/* ============================================================
   Intérprete de Java
   Ejecuta un subconjunto de Java (el que se da en el curso) dentro del navegador. Se usa en el editor, los simuladores y la corrección.
   ============================================================ */
/* Intérprete de un subconjunto de Java para los temas 1 y 2 de Programación (1º DAM).
   Soporta: tipos primitivos, String, operadores, casting, if/switch/bucles, break/continue/return,
   Scanner, Math, métodos estáticos, clases sencillas, excepciones y assert. Sin arrays por ahora. */
(function (root) {
  'use strict';

  function CompileError(line, msg) {
    this.line = line;
    this.msg = msg;
  }
  function Halt(msg) {
    this.msg = msg;
  }
  function Wait() {}
  function JThrow(obj) {
    this.obj = obj;
  }
  function Exit(code) {
    this.code = code;
  }

  /* ---------------- Léxico ---------------- */
  var OPS = [
    '>>>=',
    '<<=',
    '>>=',
    '>>>',
    '...',
    '++',
    '--',
    '&&',
    '||',
    '==',
    '!=',
    '<=',
    '>=',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '&=',
    '|=',
    '^=',
    '->',
    '::',
    '<<',
    '>>',
    '+',
    '-',
    '*',
    '/',
    '%',
    '<',
    '>',
    '=',
    '!',
    '~',
    '?',
    ':',
    ';',
    ',',
    '.',
    '(',
    ')',
    '{',
    '}',
    '[',
    ']',
    '&',
    '|',
    '^'
  ];
  var NUMRE =
    /0[xX][0-9a-fA-F_]+[lL]?|0[bB][01_]+[lL]?|(?:\d[\d_]*\.?[\d_]*(?:[eE][+-]?\d+)?|\.\d[\d_]*(?:[eE][+-]?\d+)?)[fFdDlL]?/y;

  function lex(src) {
    var toks = [],
      i = 0,
      n = src.length,
      line = 1;
    function err(m) {
      throw new CompileError(line, m);
    }
    while (i < n) {
      var c = src[i];
      if (c === '\n') {
        line++;
        i++;
        continue;
      }
      if (/\s/.test(c)) {
        i++;
        continue;
      }
      if (c === '/' && src[i + 1] === '/') {
        while (i < n && src[i] !== '\n') i++;
        continue;
      }
      if (c === '/' && src[i + 1] === '*') {
        var e = src.indexOf('*/', i + 2);
        if (e < 0) err('comentario sin cerrar: falta */');
        for (var k = i; k < e; k++) if (src[k] === '\n') line++;
        i = e + 2;
        continue;
      }
      if (/[\p{L}_$]/u.test(c)) {
        var j = i + 1;
        while (j < n && /[\p{L}\p{N}_$]/u.test(src[j])) j++;
        toks.push({ t: 'id', v: src.slice(i, j), line: line });
        i = j;
        continue;
      }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
        NUMRE.lastIndex = i;
        var m = NUMRE.exec(src);
        var s = m[0];
        i += s.length;
        var raw = s.replace(/_/g, ''),
          tk = { t: 'num', line: line };
        var last = raw[raw.length - 1],
          hex = /^0[xXbB]/.test(raw);
        if (/[lL]$/.test(raw)) {
          tk.k = 'long';
          tk.v = BigInt(raw.slice(0, -1));
        } else if (!hex && /[fF]$/.test(raw)) {
          tk.k = 'float';
          tk.v = Math.fround(parseFloat(raw));
        } else if (!hex && (/[dD]$/.test(raw) || /[.eE]/.test(raw))) {
          tk.k = 'double';
          tk.v = parseFloat(raw);
        } else {
          var big = BigInt(raw);
          tk.k = 'int';
          if (big > 2147483648n)
            throw new CompileError(line, 'número entero demasiado grande: ' + raw + ' (usa L para long)');
          tk.v = Number(big);
          tk.big = big === 2147483648n;
        }
        toks.push(tk);
        continue;
      }
      if (c === '"') {
        var j2 = i + 1,
          str = '';
        while (true) {
          if (j2 >= n || src[j2] === '\n') err('cadena sin cerrar: falta la comilla "');
          var ch = src[j2];
          if (ch === '"') break;
          if (ch === '\\') {
            var nx = src[j2 + 1];
            j2 += 2;
            if (nx === 'n') str += '\n';
            else if (nx === 't') str += '\t';
            else if (nx === 'r') str += '\r';
            else if (nx === '0') str += '\0';
            else if (nx === 'u') {
              str += String.fromCharCode(parseInt(src.substr(j2, 4), 16));
              j2 += 4;
            } else str += nx;
            continue;
          }
          str += ch;
          j2++;
        }
        toks.push({ t: 'str', v: str, line: line });
        i = j2 + 1;
        continue;
      }
      if (c === "'") {
        var j3 = i + 1,
          cv;
        if (src[j3] === '\\') {
          var q = src[j3 + 1];
          j3 += 2;
          cv =
            q === 'n'
              ? 10
              : q === 't'
                ? 9
                : q === 'r'
                  ? 13
                  : q === '0'
                    ? 0
                    : q === 'u'
                      ? ((j3 += 4), parseInt(src.substr(j3 - 4, 4), 16))
                      : q.charCodeAt(0);
        } else {
          cv = src.charCodeAt(j3);
          j3++;
        }
        if (src[j3] !== "'")
          err("carácter mal escrito: los char van entre comillas simples y con un solo carácter, como 'a'");
        toks.push({ t: 'chr', v: cv, line: line });
        i = j3 + 1;
        continue;
      }
      var op = null;
      for (var oi = 0; oi < OPS.length; oi++)
        if (src.startsWith(OPS[oi], i)) {
          op = OPS[oi];
          break;
        }
      if (!op) err('carácter no válido: ' + c);
      toks.push({ t: 'op', v: op, line: line });
      i += op.length;
    }
    toks.push({ t: 'eof', v: '<fin>', line: line });
    return toks;
  }

  /* ---------------- Sintaxis ---------------- */
  var PRIMS = { byte: 1, short: 1, int: 1, long: 1, float: 1, double: 1, char: 1, boolean: 1 };
  var RESERVED = {
    abstract: 1,
    assert: 1,
    boolean: 1,
    break: 1,
    byte: 1,
    case: 1,
    catch: 1,
    char: 1,
    class: 1,
    continue: 1,
    default: 1,
    do: 1,
    double: 1,
    else: 1,
    extends: 1,
    final: 1,
    finally: 1,
    float: 1,
    for: 1,
    if: 1,
    implements: 1,
    import: 1,
    instanceof: 1,
    int: 1,
    interface: 1,
    long: 1,
    new: 1,
    package: 1,
    private: 1,
    protected: 1,
    public: 1,
    return: 1,
    short: 1,
    static: 1,
    super: 1,
    switch: 1,
    this: 1,
    throw: 1,
    throws: 1,
    try: 1,
    void: 1,
    while: 1,
    true: 1,
    false: 1,
    null: 1
  };
  var MODS = { public: 1, private: 1, protected: 1, static: 1, final: 1, abstract: 1 };

  function Parser(toks) {
    this.t = toks;
    this.p = 0;
  }
  var P = Parser.prototype;
  P.peek = function (k) {
    return this.t[Math.min(this.p + (k || 0), this.t.length - 1)];
  };
  P.next = function () {
    return this.t[this.p++];
  };
  P.line = function () {
    return this.peek().line;
  };
  P.isOp = function (v, k) {
    var t = this.peek(k);
    return t.t === 'op' && t.v === v;
  };
  P.isId = function (v, k) {
    var t = this.peek(k);
    return t.t === 'id' && t.v === v;
  };
  P.err = function (m, tok) {
    throw new CompileError((tok || this.peek()).line, m);
  };
  P.errPrev = function (m) {
    var pt = this.t[Math.max(this.p - 1, 0)];
    throw new CompileError(pt.line, m);
  };
  P.expectOp = function (v) {
    if (this.isOp(v)) return this.next();
    if (v === ';' || v === ')' || v === '}' || v === ']' || v === '(' || v === '{')
      this.errPrev("se esperaba '" + v + "'" + (v === ';' ? ' al final de la instrucción' : ''));
    this.err("se esperaba '" + v + "'");
  };
  P.expectId = function () {
    var t = this.peek();
    if (t.t !== 'id' || RESERVED[t.v])
      this.err(
        'se esperaba un identificador' + (t.t === 'id' ? ' (' + t.v + ' es una palabra reservada)' : '')
      );
    return this.next().v;
  };
  P.acceptOp = function (v) {
    if (this.isOp(v)) {
      this.p++;
      return true;
    }
    return false;
  };

  P.parseProgram = function () {
    while (this.isId('package') || this.isId('import')) {
      while (!this.isOp(';') && this.peek().t !== 'eof') this.p++;
      this.expectOp(';');
    }
    var k = 0;
    while (this.peek(k).t === 'id' && MODS[this.peek(k).v]) k++;
    if (this.isId('class', k)) {
      var classes = [];
      while (this.peek().t !== 'eof') classes.push(this.parseClass());
      return { mode: 'class', classes: classes };
    }
    var stmts = [];
    while (this.peek().t !== 'eof') {
      if (this.isOp('}')) this.err("sobra una llave '}'");
      stmts.push(this.parseStatement());
    }
    return { mode: 'body', stmts: stmts };
  };

  P.parseMods = function () {
    var m = {};
    while (this.peek().t === 'id' && MODS[this.peek().v]) m[this.next().v] = true;
    return m;
  };

  P.parseType = function () {
    var t = this.peek();
    if (t.t !== 'id') this.err('se esperaba un tipo');
    if (t.v === 'void') {
      this.p++;
      return 'void';
    }
    if (RESERVED[t.v] && !PRIMS[t.v]) this.err('se esperaba un tipo, y ' + t.v + ' no lo es');
    this.p++;
    var name = t.v;
    while (this.isOp('.') && this.peek(1).t === 'id' && /^[A-Z]/.test(this.peek(1).v)) {
      this.p++;
      name = this.next().v;
    }
    if (this.isOp('<')) this.err('los genéricos (<...>) no están soportados todavía en este laboratorio');
    if (this.isOp('[')) this.err('los arrays no están soportados todavía en este laboratorio');
    return name;
  };

  P.parseClass = function () {
    var mods = this.parseMods();
    if (!this.isId('class')) this.err("se esperaba 'class'");
    this.p++;
    var name = this.expectId(),
      parent = null;
    if (this.isId('extends')) {
      this.p++;
      parent = this.expectId();
    }
    if (this.isId('implements')) this.err('las interfaces no están soportadas todavía');
    this.expectOp('{');
    var cls = { name: name, parent: parent, fields: [], methods: [], ctors: [], line: this.line() };
    while (!this.isOp('}')) {
      if (this.peek().t === 'eof') this.errPrev("falta la llave '}' que cierra la clase " + name);
      var mm = this.parseMods();
      if (this.peek().t === 'id' && this.peek().v === name && this.isOp('(', 1)) {
        this.p++;
        var params = this.parseParams();
        this.parseThrows();
        cls.ctors.push({ params: params, body: this.parseBlock(), mods: mm });
        continue;
      }
      var ty = this.parseType(),
        nm = this.expectId();
      if (this.isOp('(')) {
        var ps = this.parseParams(),
          th = this.parseThrows(),
          body = null;
        if (this.isOp('{')) body = this.parseBlock();
        else this.expectOp(';');
        cls.methods.push({
          name: nm,
          ret: ty,
          params: ps,
          body: body,
          mods: mm,
          throwsList: th,
          line: this.line()
        });
      } else {
        var decls = [{ name: nm, init: null }];
        if (this.acceptOp('=')) decls[0].init = this.parseExpr();
        while (this.acceptOp(',')) {
          var n2 = this.expectId(),
            i2 = null;
          if (this.acceptOp('=')) i2 = this.parseExpr();
          decls.push({ name: n2, init: i2 });
        }
        this.expectOp(';');
        decls.forEach(function (d) {
          cls.fields.push({ name: d.name, type: ty, init: d.init, mods: mm });
        });
      }
    }
    this.expectOp('}');
    return cls;
  };
  P.parseParams = function () {
    this.expectOp('(');
    var ps = [];
    if (!this.isOp(')')) {
      do {
        if (this.isId('final')) this.p++;
        var ty = this.parseTypeParam(),
          nm = this.expectId();
        ps.push({ type: ty, name: nm });
      } while (this.acceptOp(','));
    }
    this.expectOp(')');
    return ps;
  };
  P.parseTypeParam = function () {
    var t = this.peek();
    if (t.t !== 'id') this.err('se esperaba un tipo');
    if (t.v === 'String' && this.isOp('[', 1) && this.isOp(']', 2)) {
      this.p += 3;
      return 'String[]';
    }
    if (t.v === 'String' && this.isOp('...', 1)) {
      this.p += 2;
      return 'String[]';
    }
    return this.parseType();
  };
  P.parseThrows = function () {
    var l = [];
    if (this.isId('throws')) {
      this.p++;
      do {
        l.push(this.expectId());
      } while (this.acceptOp(','));
    }
    return l;
  };

  P.parseBlock = function () {
    this.expectOp('{');
    var line = this.line(),
      stmts = [];
    while (!this.isOp('}')) {
      if (this.peek().t === 'eof') this.errPrev("falta la llave '}' que cierra el bloque");
      stmts.push(this.parseStatement());
    }
    this.expectOp('}');
    return { k: 'block', stmts: stmts, line: line };
  };

  P.isDeclStart = function () {
    var t = this.peek();
    if (t.t !== 'id') return false;
    if (t.v === 'final') return true;
    if (PRIMS[t.v]) return true;
    if (t.v === 'var' && this.peek(1).t === 'id') return true;
    if (RESERVED[t.v]) return false;
    // Nombre Nombre (= | ; | ,)
    var a = this.peek(1);
    if (a.t === 'id' && !RESERVED[a.v] && a.v !== 'instanceof') return true;
    if (
      this.isOp('.', 1) &&
      /^[A-Z]/.test(t.v) &&
      this.peek(2).t === 'id' &&
      /^[A-Z]/.test(this.peek(2).v) &&
      this.peek(3).t === 'id'
    )
      return true;
    return false;
  };

  P.parseDecl = function (needSemi) {
    var line = this.line(),
      fin = false;
    if (this.isId('final')) {
      this.p++;
      fin = true;
    }
    var ty;
    if (this.isId('var') && this.peek(1).t === 'id') {
      this.p++;
      ty = 'var';
    } else ty = this.parseType();
    var ds = [];
    do {
      var nm = this.expectId(),
        init = null;
      if (this.isOp('[')) this.err('los arrays no están soportados todavía en este laboratorio');
      if (this.acceptOp('=')) init = this.parseExpr();
      if (ty === 'var' && !init)
        this.err(
          "'var' necesita inicializar la variable en la misma línea (Java no puede deducir el tipo sin un valor)"
        );
      ds.push({ name: nm, init: init });
    } while (this.acceptOp(','));
    if (needSemi) this.expectOp(';');
    return { k: 'decl', type: ty, fin: fin, decls: ds, line: line };
  };

  P.parseStatement = function () {
    var t = this.peek(),
      line = t.line;
    if (t.t === 'op') {
      if (t.v === '{') return this.parseBlock();
      if (t.v === ';') {
        this.p++;
        return { k: 'empty', line: line };
      }
    }
    if (t.t === 'id') {
      switch (t.v) {
        case 'if': {
          this.p++;
          this.expectOp('(');
          var c = this.parseExpr();
          this.expectOp(')');
          var th = this.parseStatement(),
            el = null;
          if (this.isId('else')) {
            this.p++;
            el = this.parseStatement();
          }
          return { k: 'if', cond: c, then: th, els: el, line: line };
        }
        case 'else':
          this.err("'else' sin su 'if' correspondiente");
          break;
        case 'while': {
          this.p++;
          this.expectOp('(');
          var wc = this.parseExpr();
          this.expectOp(')');
          return { k: 'while', cond: wc, body: this.parseStatement(), line: line };
        }
        case 'do': {
          this.p++;
          var body = this.parseStatement();
          if (!this.isId('while')) this.err("se esperaba 'while' después del cuerpo del do");
          this.p++;
          this.expectOp('(');
          var dc = this.parseExpr();
          this.expectOp(')');
          this.expectOp(';');
          return { k: 'dowhile', cond: dc, body: body, line: line };
        }
        case 'for':
          return this.parseFor();
        case 'switch': {
          var sw = this.parseSwitch(false);
          return sw;
        }
        case 'return': {
          this.p++;
          var rv = null;
          if (!this.isOp(';')) rv = this.parseExpr();
          this.expectOp(';');
          return { k: 'return', expr: rv, line: line };
        }
        case 'break':
          this.p++;
          this.expectOp(';');
          return { k: 'break', line: line };
        case 'continue':
          this.p++;
          this.expectOp(';');
          return { k: 'continue', line: line };
        case 'throw': {
          this.p++;
          var te = this.parseExpr();
          this.expectOp(';');
          return { k: 'throw', expr: te, line: line };
        }
        case 'try':
          return this.parseTry();
        case 'assert': {
          this.p++;
          var ac = this.parseExpr(),
            am = null;
          if (this.acceptOp(':')) am = this.parseExpr();
          this.expectOp(';');
          return { k: 'assert', cond: ac, msg: am, line: line };
        }
        case 'super':
          if (this.isOp('(', 1)) {
            this.p++;
            var sa = this.parseArgs();
            this.expectOp(';');
            return { k: 'superctor', args: sa, line: line };
          }
          break;
        case 'class':
          this.err('no se pueden declarar clases dentro de un método');
      }
      if (this.isDeclStart()) return this.parseDecl(true);
    }
    var e = this.parseExpr();
    if (!(e.k === 'assign' || e.k === 'call' || e.k === 'mcall' || e.k === 'incdec' || e.k === 'new')) {
      throw new CompileError(
        line,
        'esto no es una instrucción válida (una expresión suelta como esta no hace nada): ¿falta una asignación o una llamada?'
      );
    }
    this.expectOp(';');
    return { k: 'expr', expr: e, line: line };
  };

  P.parseFor = function () {
    var line = this.line();
    this.p++;
    this.expectOp('(');
    var init = [],
      cond = null,
      upd = [];
    if (!this.isOp(';')) {
      if (this.isDeclStart()) {
        var save = this.p;
        var d = this.parseDecl(false);
        if (this.isOp(':')) this.err('el for-each necesita arrays, que no están soportados todavía');
        init.push(d);
      } else {
        do {
          init.push({ k: 'expr', expr: this.parseExpr(), line: line });
        } while (this.acceptOp(','));
      }
    }
    this.expectOp(';');
    if (!this.isOp(';')) cond = this.parseExpr();
    this.expectOp(';');
    if (!this.isOp(')')) {
      do {
        upd.push(this.parseExpr());
      } while (this.acceptOp(','));
    }
    this.expectOp(')');
    return { k: 'for', init: init, cond: cond, upd: upd, body: this.parseStatement(), line: line };
  };

  P.parseSwitch = function (isExpr) {
    var line = this.line();
    this.p++;
    this.expectOp('(');
    var e = this.parseExpr();
    this.expectOp(')');
    this.expectOp('{');
    var cases = [],
      arrow = null;
    while (!this.isOp('}')) {
      if (this.peek().t === 'eof') this.errPrev("falta la llave '}' del switch");
      var labels = null,
        lt = this.peek();
      if (this.isId('case')) {
        this.p++;
        labels = [];
        do {
          labels.push(this.parseTernary());
        } while (this.acceptOp(','));
      } else if (this.isId('default')) {
        this.p++;
      } else this.err("dentro de un switch se esperaba 'case' o 'default'");
      var isArrow;
      if (this.acceptOp('->')) isArrow = true;
      else if (this.acceptOp(':')) isArrow = false;
      else this.err("se esperaba ':' o '->' después del case");
      if (arrow !== null && arrow !== isArrow)
        this.err("no se pueden mezclar 'case ... :' y 'case ... ->' en el mismo switch", lt);
      arrow = isArrow;
      var body;
      if (isArrow) {
        if (this.isOp('{')) body = this.parseBlock();
        else if (this.isId('throw')) body = this.parseStatement();
        else {
          var ex = this.parseExpr();
          this.expectOp(';');
          body = { k: 'expr', expr: ex, line: lt.line, val: true };
        }
      } else {
        body = [];
        while (!this.isOp('}') && !this.isId('case') && !this.isId('default')) {
          if (this.peek().t === 'eof') this.errPrev("falta la llave '}' del switch");
          body.push(this.parseStatement());
        }
      }
      cases.push({ labels: labels, body: body, line: lt.line });
    }
    this.expectOp('}');
    return { k: 'switch', expr: e, cases: cases, arrow: !!arrow, isExpr: isExpr, line: line };
  };

  P.parseTry = function () {
    var line = this.line();
    this.p++;
    if (this.isOp('(')) this.err('try con recursos no está soportado todavía');
    var block = this.parseBlock(),
      catches = [],
      fin = null;
    while (this.isId('catch')) {
      this.p++;
      this.expectOp('(');
      if (this.isId('final')) this.p++;
      var types = [this.expectId()];
      while (this.acceptOp('|')) types.push(this.expectId());
      var nm = this.expectId();
      this.expectOp(')');
      catches.push({ types: types, name: nm, body: this.parseBlock() });
    }
    if (this.isId('finally')) {
      this.p++;
      fin = this.parseBlock();
    }
    if (!catches.length && !fin) this.err("un 'try' necesita al menos un 'catch' o un 'finally'");
    return { k: 'try', block: block, catches: catches, fin: fin, line: line };
  };

  P.parseArgs = function () {
    this.expectOp('(');
    var a = [];
    if (!this.isOp(')')) {
      do {
        a.push(this.parseExpr());
      } while (this.acceptOp(','));
    }
    this.expectOp(')');
    return a;
  };

  var ASSIGN = {
    '=': 1,
    '+=': 1,
    '-=': 1,
    '*=': 1,
    '/=': 1,
    '%=': 1,
    '&=': 1,
    '|=': 1,
    '^=': 1,
    '<<=': 1,
    '>>=': 1,
    '>>>=': 1
  };
  P.parseExpr = function () {
    var left = this.parseTernary(),
      t = this.peek();
    if (t.t === 'op' && ASSIGN[t.v]) {
      if (left.k !== 'id' && left.k !== 'field')
        this.err('a la izquierda de una asignación debe haber una variable', t);
      this.p++;
      var right = this.parseExpr();
      return { k: 'assign', op: t.v, target: left, expr: right, line: t.line };
    }
    return left;
  };
  P.parseTernary = function () {
    var c = this.parseBin(0);
    if (this.isOp('?')) {
      var line = this.line();
      this.p++;
      var a = this.parseExpr();
      this.expectOp(':');
      var b = this.parseTernary();
      return { k: 'cond', cond: c, a: a, b: b, line: line };
    }
    return c;
  };
  var BINPREC = [
    ['||'],
    ['&&'],
    ['|'],
    ['^'],
    ['&'],
    ['==', '!='],
    ['<', '>', '<=', '>=', 'instanceof'],
    ['<<', '>>', '>>>'],
    ['+', '-'],
    ['*', '/', '%']
  ];
  P.parseBin = function (lvl) {
    if (lvl >= BINPREC.length) return this.parseUnary();
    var left = this.parseBin(lvl + 1);
    while (true) {
      var t = this.peek(),
        ops = BINPREC[lvl];
      var isOpTok =
        (t.t === 'op' && ops.indexOf(t.v) >= 0) ||
        (t.t === 'id' && t.v === 'instanceof' && ops.indexOf('instanceof') >= 0);
      if (!isOpTok) break;
      this.p++;
      if (t.v === 'instanceof') {
        var tn = this.expectId();
        left = { k: 'instanceof', expr: left, type: tn, line: t.line };
        continue;
      }
      var right = this.parseBin(lvl + 1);
      if (t.v === '&&' || t.v === '||') left = { k: 'logic', op: t.v, a: left, b: right, line: t.line };
      else left = { k: 'bin', op: t.v, a: left, b: right, line: t.line };
    }
    return left;
  };
  P.parseUnary = function () {
    var t = this.peek();
    if (t.t === 'op') {
      if (t.v === '-') {
        this.p++;
        var nt = this.peek();
        if (nt.t === 'num' && nt.k === 'int' && nt.big) {
          this.p++;
          return this.parsePostfixOps({ k: 'lit', val: { t: 'int', v: -2147483648 }, line: t.line });
        }
        return { k: 'unary', op: '-', expr: this.parseUnary(), line: t.line };
      }
      if (t.v === '+' || t.v === '!' || t.v === '~') {
        this.p++;
        return { k: 'unary', op: t.v, expr: this.parseUnary(), line: t.line };
      }
      if (t.v === '++' || t.v === '--') {
        this.p++;
        var e = this.parseUnary();
        if (e.k !== 'id' && e.k !== 'field') this.err('++ y -- se aplican a una variable', t);
        return { k: 'incdec', op: t.v, prefix: true, target: e, line: t.line };
      }
      if (t.v === '(' && this.peek(1).t === 'id' && PRIMS[this.peek(1).v] && this.isOp(')', 2)) {
        var ty = this.peek(1).v;
        this.p += 3;
        return { k: 'cast', type: ty, expr: this.parseUnary(), line: t.line };
      }
    }
    return this.parsePostfix();
  };
  P.parsePostfix = function () {
    return this.parsePostfixOps(this.parsePrimary());
  };
  P.parsePostfixOps = function (e) {
    while (true) {
      var t = this.peek();
      if (t.t === 'op' && t.v === '.') {
        this.p++;
        var nm = this.expectId();
        if (this.isOp('(')) e = { k: 'mcall', obj: e, name: nm, args: this.parseArgs(), line: t.line };
        else e = { k: 'field', obj: e, name: nm, line: t.line };
      } else if (t.t === 'op' && (t.v === '++' || t.v === '--')) {
        if (e.k !== 'id' && e.k !== 'field') this.err('++ y -- se aplican a una variable', t);
        this.p++;
        e = { k: 'incdec', op: t.v, prefix: false, target: e, line: t.line };
      } else if (t.t === 'op' && t.v === '[') {
        this.err('los arrays no están soportados todavía en este laboratorio');
      } else break;
    }
    return e;
  };
  P.parsePrimary = function () {
    var t = this.next(),
      line = t.line;
    switch (t.t) {
      case 'num': {
        if (t.k === 'int' && t.big) this.err('número entero demasiado grande: 2147483648', t);
        var v = t.k === 'long' ? BigInt.asIntN(64, t.v) : t.v;
        return { k: 'lit', val: { t: t.k, v: v }, line: line };
      }
      case 'str':
        return { k: 'lit', val: { t: 'String', v: t.v }, line: line };
      case 'chr':
        return { k: 'lit', val: { t: 'char', v: t.v }, line: line };
      case 'op':
        if (t.v === '(') {
          var e = this.parseExpr();
          this.expectOp(')');
          return { k: 'paren', expr: e, line: line };
        }
        this.p--;
        this.err("no se esperaba '" + t.v + "' aquí");
        break;
      case 'id':
        if (t.v === 'true') return { k: 'lit', val: { t: 'boolean', v: true }, line: line };
        if (t.v === 'false') return { k: 'lit', val: { t: 'boolean', v: false }, line: line };
        if (t.v === 'null') return { k: 'lit', val: { t: 'null', v: null }, line: line };
        if (t.v === 'this') return { k: 'this', line: line };
        if (t.v === 'new') {
          var cn = this.expectId();
          while (this.isOp('.')) {
            this.p++;
            cn = this.expectId();
          }
          if (this.isOp('[')) this.err('los arrays no están soportados todavía en este laboratorio');
          return { k: 'new', cls: cn, args: this.parseArgs(), line: line };
        }
        if (t.v === 'switch') {
          this.p--;
          return this.parseSwitch(true);
        }
        if (RESERVED[t.v]) {
          this.p--;
          this.err("no se esperaba la palabra reservada '" + t.v + "' aquí");
        }
        if (this.isOp('(')) return { k: 'call', name: t.v, args: this.parseArgs(), line: line };
        return { k: 'id', name: t.v, line: line };
      case 'eof':
        this.p--;
        this.errPrev('la expresión está incompleta');
    }
    this.err('expresión no válida');
  };

  /* ---------------- Valores ---------------- */
  var NULL = { t: 'null', v: null };
  function Iv(n) {
    return { t: 'int', v: n | 0 };
  }
  function Bv(b) {
    return { t: 'boolean', v: !!b };
  }
  function Sv(s) {
    return { t: 'String', v: s };
  }
  var NUMT = { byte: 1, short: 1, int: 1, long: 1, float: 1, double: 1, char: 1 };
  function isNum(t) {
    return NUMT[t] === 1;
  }
  var WIDEN = {
    byte: ['short', 'int', 'long', 'float', 'double'],
    short: ['int', 'long', 'float', 'double'],
    char: ['int', 'long', 'float', 'double'],
    int: ['long', 'float', 'double'],
    long: ['float', 'double'],
    float: ['double']
  };

  function d2i(x) {
    if (x !== x) return 0;
    if (x >= 2147483647) return 2147483647;
    if (x <= -2147483648) return -2147483648;
    return Math.trunc(x);
  }
  function toInt32(v) {
    if (v.t === 'long') return Number(BigInt.asIntN(32, v.v));
    if (v.t === 'float' || v.t === 'double') return d2i(v.v);
    return v.v | 0;
  }
  function toLong(v) {
    if (v.t === 'long') return v.v;
    if (v.t === 'float' || v.t === 'double') {
      var x = v.v;
      if (x !== x) return 0n;
      if (x >= 9223372036854775807) return 9223372036854775807n;
      if (x <= -9223372036854775808) return -9223372036854775808n;
      return BigInt(Math.trunc(x));
    }
    return BigInt(v.v);
  }
  function toNumber(v) {
    return v.t === 'long' ? Number(v.v) : v.v;
  }
  function castNum(v, type) {
    switch (type) {
      case 'byte':
        return { t: 'byte', v: (toInt32(v) << 24) >> 24 };
      case 'short':
        return { t: 'short', v: (toInt32(v) << 16) >> 16 };
      case 'char':
        return { t: 'char', v: toInt32(v) & 65535 };
      case 'int':
        return { t: 'int', v: toInt32(v) };
      case 'long':
        return { t: 'long', v: toLong(v) };
      case 'float':
        return { t: 'float', v: Math.fround(toNumber(v)) };
      case 'double':
        return { t: 'double', v: toNumber(v) };
    }
  }
  function promote(a, b) {
    if (a === 'double' || b === 'double') return 'double';
    if (a === 'float' || b === 'float') return 'float';
    if (a === 'long' || b === 'long') return 'long';
    return 'int';
  }

  /* ---- formato Java de números ---- */
  function jd(x) {
    if (x !== x) return 'NaN';
    if (x === Infinity) return 'Infinity';
    if (x === -Infinity) return '-Infinity';
    if (x === 0) return 1 / x < 0 ? '-0.0' : '0.0';
    var a = Math.abs(x);
    if (a >= 1e-3 && a < 1e7) {
      var s = String(x);
      if (s.indexOf('.') < 0) s += '.0';
      return s;
    }
    var e = x.toExponential(),
      parts = e.split('e'),
      m = parts[0],
      ex = parts[1];
    if (m.indexOf('.') < 0) m += '.0';
    return m + 'E' + (ex[0] === '+' ? ex.slice(1) : ex);
  }
  function jf(x) {
    if (x !== x || x === Infinity || x === -Infinity || x === 0) return jd(x);
    for (var p = 1; p <= 9; p++) {
      var s = x.toPrecision(p);
      if (Math.fround(parseFloat(s)) === x) return jd(parseFloat(s));
    }
    return jd(x);
  }

  /* ---------------- Clases predefinidas ---------------- */
  var BUILTIN = {};
  function defB(name, parent, pkg) {
    BUILTIN[name] = {
      name: name,
      parent: parent,
      pkg: pkg,
      builtin: true,
      fields: [],
      methods: [],
      ctors: []
    };
  }
  defB('Object', null, 'java.lang');
  defB('Throwable', 'Object', 'java.lang');
  defB('Exception', 'Throwable', 'java.lang');
  defB('Error', 'Throwable', 'java.lang');
  defB('AssertionError', 'Error', 'java.lang');
  defB('StackOverflowError', 'Error', 'java.lang');
  defB('RuntimeException', 'Exception', 'java.lang');
  defB('IOException', 'Exception', 'java.io');
  defB('ArithmeticException', 'RuntimeException', 'java.lang');
  defB('IllegalArgumentException', 'RuntimeException', 'java.lang');
  defB('IllegalStateException', 'RuntimeException', 'java.lang');
  defB('NullPointerException', 'RuntimeException', 'java.lang');
  defB('NumberFormatException', 'IllegalArgumentException', 'java.lang');
  defB('ClassCastException', 'RuntimeException', 'java.lang');
  defB('UnsupportedOperationException', 'RuntimeException', 'java.lang');
  defB('NoSuchElementException', 'RuntimeException', 'java.util');
  defB('InputMismatchException', 'NoSuchElementException', 'java.util');
  defB('StringIndexOutOfBoundsException', 'RuntimeException', 'java.lang');

  /* ---------------- Intérprete ---------------- */
  function Interp(opts) {
    this.opts = opts || {};
    this.out = [];
    this.err = [];
    this.outLen = 0;
    this.steps = 0;
    this.maxSteps = this.opts.maxSteps || 1500000;
    this.classes = {};
    this.depth = 0;
    this.scanner = { s: String(this.opts.input == null ? '' : this.opts.input), p: 0 };
    this.ea = !!this.opts.ea;
    this.echoAt = {};
  }
  var I = Interp.prototype;

  I.cerr = function (line, msg) {
    throw new CompileError(line, msg);
  };
  I.tick = function () {
    if (++this.steps > this.maxSteps)
      throw new Halt(
        'El programa tardó demasiado (más de ' +
          this.maxSteps +
          ' pasos). ¿Hay un bucle infinito? Revisa que la variable de la condición cambie dentro del bucle.'
      );
  };
  I.write = function (s, isErr) {
    if (isErr) {
      this.err.push(s);
      return;
    }
    this.out.push(s);
    this.outLen += s.length;
    if (this.outLen > 60000) throw new Halt('El programa escribió demasiado texto: posible bucle infinito.');
  };

  I.getClass = function (name) {
    return this.classes[name] || BUILTIN[name] || null;
  };
  I.isSub = function (cn, target) {
    while (cn) {
      if (cn === target) return true;
      var c = this.getClass(cn);
      cn = c ? c.parent : null;
    }
    return false;
  };
  I.fullName = function (cn) {
    var c = this.getClass(cn);
    return c && c.builtin ? c.pkg + '.' + cn : cn;
  };

  I.mkThrowable = function (cn, msg) {
    return { t: 'obj', cls: cn, f: { message: msg == null ? NULL : Sv(msg) } };
  };
  I.jthrow = function (cn, msg) {
    throw new JThrow(this.mkThrowable(cn, msg));
  };

  /* conversión de tipos */
  I.typeName = function (v) {
    return v.t === 'obj' ? v.cls : v.t === 'null' ? 'null' : v.t;
  };
  I.isConst = function (n) {
    if (!n) return false;
    if (n.k === 'lit') return true;
    if (n.k === 'paren') return this.isConst(n.expr);
    if (n.k === 'unary') return this.isConst(n.expr);
    if (n.k === 'bin') return this.isConst(n.a) && this.isConst(n.b);
    if (n.k === 'cast') return this.isConst(n.expr);
    return false;
  };
  function fits(v, type) {
    if (type === 'byte') return v >= -128 && v <= 127;
    if (type === 'short') return v >= -32768 && v <= 32767;
    if (type === 'char') return v >= 0 && v <= 65535;
    return true;
  }
  I.convert = function (val, type, node, line) {
    var vt = val.t;
    if (vt === type) return val;
    if (type === 'var') return val;
    if (isNum(type)) {
      if (!isNum(vt))
        this.cerr(line, 'tipos incompatibles: ' + this.typeName(val) + ' no se puede convertir a ' + type);
      if (WIDEN[vt] && WIDEN[vt].indexOf(type) >= 0) return castNum(val, type);
      if (
        (vt === 'int' || vt === 'short' || vt === 'char' || vt === 'byte') &&
        (type === 'byte' || type === 'short' || type === 'char') &&
        this.isConst(node) &&
        fits(val.v, type)
      )
        return castNum(val, type);
      this.cerr(
        line,
        'tipos incompatibles: posible pérdida de precisión al convertir ' +
          vt +
          ' a ' +
          type +
          (this.isConst(node) && vt === 'int'
            ? ''
            : ' (hace falta un casting explícito, por ejemplo (' + type + ')) ')
      );
    }
    if (type === 'boolean')
      this.cerr(line, 'tipos incompatibles: ' + this.typeName(val) + ' no se puede convertir a boolean');
    if (type === 'String') {
      if (vt === 'null') return val;
      this.cerr(line, 'tipos incompatibles: ' + this.typeName(val) + ' no se puede convertir a String');
    }
    if (vt === 'null') return val;
    if (type === 'Object') return val;
    if (vt === 'obj') {
      if (this.isSub(val.cls, type)) return val;
      this.cerr(line, 'tipos incompatibles: ' + val.cls + ' no se puede convertir a ' + type);
    }
    if (type === 'Scanner' && vt === 'scanner') return val;
    this.cerr(line, 'tipos incompatibles: ' + this.typeName(val) + ' no se puede convertir a ' + type);
  };
  I.defaultVal = function (type) {
    switch (type) {
      case 'int':
      case 'byte':
      case 'short':
        return { t: type, v: 0 };
      case 'long':
        return { t: 'long', v: 0n };
      case 'float':
      case 'double':
        return { t: type, v: 0 };
      case 'char':
        return { t: 'char', v: 0 };
      case 'boolean':
        return Bv(false);
    }
    return NULL;
  };

  I.toStr = function (v) {
    switch (v.t) {
      case 'String':
        return v.v;
      case 'char':
        return String.fromCharCode(v.v);
      case 'boolean':
        return v.v ? 'true' : 'false';
      case 'null':
        return 'null';
      case 'long':
        return v.v.toString();
      case 'double':
        return jd(v.v);
      case 'float':
        return jf(v.v);
      case 'obj': {
        var m = this.findMethod(v.cls, 'toString', 0);
        if (m) {
          var r = this.callMethod(m.cls, m.m, v, [], 0);
          return this.toStr(r);
        }
        if (this.isSub(v.cls, 'Throwable')) {
          var msg = v.f.message;
          return this.fullName(v.cls) + (msg && msg.t !== 'null' ? ': ' + msg.v : '');
        }
        return v.cls + '@1b6d3586';
      }
      case 'scanner':
        return 'java.util.Scanner';
    }
    return String(v.v);
  };

  /* aritmética */
  I.arith = function (op, a, b, line) {
    var t = promote(a.t, b.t);
    if (t === 'int') {
      var x = a.v,
        y = b.v;
      switch (op) {
        case '+':
          return Iv(x + y);
        case '-':
          return Iv(x - y);
        case '*':
          return Iv(Math.imul(x, y));
        case '/':
          if (y === 0) this.jthrow('ArithmeticException', '/ by zero');
          return Iv(Math.trunc(x / y));
        case '%':
          if (y === 0) this.jthrow('ArithmeticException', '/ by zero');
          return Iv(x % y);
        case '&':
          return Iv(x & y);
        case '|':
          return Iv(x | y);
        case '^':
          return Iv(x ^ y);
      }
    } else if (t === 'long') {
      var X = a.t === 'long' ? a.v : BigInt(a.v),
        Y = b.t === 'long' ? b.v : BigInt(b.v);
      var r;
      switch (op) {
        case '+':
          r = X + Y;
          break;
        case '-':
          r = X - Y;
          break;
        case '*':
          r = X * Y;
          break;
        case '/':
          if (Y === 0n) this.jthrow('ArithmeticException', '/ by zero');
          r = X / Y;
          break;
        case '%':
          if (Y === 0n) this.jthrow('ArithmeticException', '/ by zero');
          r = X % Y;
          break;
        case '&':
          r = X & Y;
          break;
        case '|':
          r = X | Y;
          break;
        case '^':
          r = X ^ Y;
          break;
      }
      return { t: 'long', v: BigInt.asIntN(64, r) };
    } else {
      var p = toNumber(a),
        q = toNumber(b),
        z;
      switch (op) {
        case '+':
          z = p + q;
          break;
        case '-':
          z = p - q;
          break;
        case '*':
          z = p * q;
          break;
        case '/':
          z = p / q;
          break;
        case '%':
          z = p % q;
          break;
        default:
          this.cerr(line, "el operador '" + op + "' no se puede usar con números decimales");
      }
      return t === 'float' ? { t: 'float', v: Math.fround(z) } : { t: 'double', v: z };
    }
  };
  I.compare = function (op, a, b) {
    var x, y;
    if (a.t === 'long' && b.t !== 'float' && b.t !== 'double') {
      x = a.v;
      y = b.t === 'long' ? b.v : BigInt(b.v);
    } else if (b.t === 'long' && a.t !== 'float' && a.t !== 'double') {
      x = BigInt(a.v);
      y = b.v;
    } else {
      x = toNumber(a);
      y = toNumber(b);
    }
    switch (op) {
      case '<':
        return x < y;
      case '>':
        return x > y;
      case '<=':
        return x <= y;
      case '>=':
        return x >= y;
    }
  };
  I.equals = function (a, b) {
    if (isNum(a.t) && isNum(b.t)) {
      if (a.t === 'long' || b.t === 'long') {
        if (a.t !== 'float' && a.t !== 'double' && b.t !== 'float' && b.t !== 'double')
          return BigInt(a.v) === BigInt(b.v);
      }
      return toNumber(a) === toNumber(b);
    }
    if (a.t === 'boolean' && b.t === 'boolean') return a.v === b.v;
    if (a.t === 'null' || b.t === 'null') return a.t === b.t;
    if (a.t === 'String' && b.t === 'String') return a.v === b.v;
    if (a.t === 'obj' && b.t === 'obj') return a === b;
    if (a.t === 'scanner' && b.t === 'scanner') return a === b;
    return false;
  };
  I.binop = function (op, a, b, line) {
    if (op === '+' && (a.t === 'String' || b.t === 'String')) return Sv(this.toStr(a) + this.toStr(b));
    if (op === '==' || op === '!=') {
      var okTypes =
        (isNum(a.t) && isNum(b.t)) ||
        (a.t === 'boolean' && b.t === 'boolean') ||
        (!isNum(a.t) && a.t !== 'boolean' && !isNum(b.t) && b.t !== 'boolean');
      if (!okTypes) this.cerr(line, 'tipos incomparables: ' + this.typeName(a) + ' y ' + this.typeName(b));
      var eq = this.equals(a, b);
      return Bv(op === '==' ? eq : !eq);
    }
    if (op === '<' || op === '>' || op === '<=' || op === '>=') {
      if (!isNum(a.t) || !isNum(b.t))
        this.cerr(
          line,
          "el operador '" + op + "' no se puede aplicar a " + this.typeName(a) + ' y ' + this.typeName(b)
        );
      return Bv(this.compare(op, a, b));
    }
    if ((op === '&' || op === '|' || op === '^') && a.t === 'boolean' && b.t === 'boolean') {
      return Bv(op === '&' ? a.v && b.v : op === '|' ? a.v || b.v : a.v !== b.v);
    }
    if (!isNum(a.t) || !isNum(b.t))
      this.cerr(
        line,
        "el operador '" + op + "' no se puede aplicar a " + this.typeName(a) + ' y ' + this.typeName(b)
      );
    if (op === '<<' || op === '>>' || op === '>>>') {
      if (a.t === 'double' || a.t === 'float' || b.t === 'double' || b.t === 'float')
        this.cerr(line, "el operador '" + op + "' solo se puede usar con números enteros");
      var sh = Number(BigInt(b.v) & (a.t === 'long' ? 63n : 31n));
      if (a.t === 'long') {
        var L = a.v;
        return {
          t: 'long',
          v: BigInt.asIntN(
            64,
            op === '<<'
              ? L << BigInt(sh)
              : op === '>>'
                ? L >> BigInt(sh)
                : BigInt.asUintN(64, L) >> BigInt(sh)
          )
        };
      }
      var xv = a.v | 0;
      return Iv(op === '<<' ? xv << sh : op === '>>' ? xv >> sh : xv >>> sh);
    }
    return this.arith(op, a, b, line);
  };

  /* ---- entorno ---- */
  I.newFrame = function (cls, thisObj, retType) {
    return { scopes: [new Map()], cls: cls, thisObj: thisObj, retType: retType };
  };
  I.lookup = function (fr, name) {
    for (var i = fr.scopes.length - 1; i >= 0; i--) {
      var e = fr.scopes[i].get(name);
      if (e) return e;
    }
    return null;
  };
  I.declare = function (fr, name, type, val, fin, line) {
    if (this.lookup(fr, name)) this.cerr(line, 'la variable ' + name + ' ya está definida en este método');
    fr.scopes[fr.scopes.length - 1].set(name, { type: type, val: val, fin: fin });
  };
  I.findField = function (cn, name) {
    while (cn) {
      var c = this.getClass(cn);
      if (!c) break;
      for (var i = 0; i < c.fields.length; i++)
        if (c.fields[i].name === name) return { cls: c, f: c.fields[i] };
      cn = c.parent;
    }
    return null;
  };
  I.findMethod = function (cn, name, nargs) {
    while (cn) {
      var c = this.getClass(cn);
      if (!c) break;
      for (var i = 0; i < c.methods.length; i++)
        if (c.methods[i].name === name && (nargs < 0 || c.methods[i].params.length === nargs))
          return { cls: c, m: c.methods[i] };
      cn = c.parent;
    }
    return null;
  };

  I.evalArgs = function (args, fr) {
    var r = [];
    for (var i = 0; i < args.length; i++) r.push(this.ev(args[i], fr));
    return r;
  };

  I.callMethod = function (cls, m, thisObj, args, line) {
    if (!m.body) this.cerr(line, 'el método ' + m.name + ' no tiene cuerpo');
    if (m.params.length !== args.length)
      this.cerr(
        line,
        'el método ' + m.name + ' espera ' + m.params.length + ' argumento(s) y recibe ' + args.length
      );
    if (++this.depth > 600) {
      this.depth = 0;
      this.jthrow('StackOverflowError', null);
    }
    var fr = this.newFrame(cls, thisObj, m.ret);
    for (var i = 0; i < m.params.length; i++) {
      var v = args[i],
        pt = m.params[i].type;
      if (pt !== 'String[]') v = this.convert(v, pt, null, line);
      fr.scopes[0].set(m.params[i].name, { type: pt, val: v, fin: false });
    }
    var c = this.execBlock(m.body, fr, true);
    this.depth--;
    if (c && c.c === 'return') return c.v || NULL;
    if (m.ret !== 'void')
      this.cerr(
        m.line || line,
        'el método ' + m.name + ' debe devolver un valor de tipo ' + m.ret + ' (falta un return)'
      );
    return NULL;
  };

  I.instantiate = function (cn, args, line) {
    var cls = this.getClass(cn);
    if (!cls) this.cerr(line, 'no se encuentra la clase ' + cn);
    var obj = { t: 'obj', cls: cn, f: {} };
    this.initFields(cn, obj);
    this.construct(cn, obj, args, line);
    return obj;
  };
  I.initFields = function (cn, obj) {
    var chain = [];
    var c = cn;
    while (c) {
      chain.unshift(c);
      var k = this.getClass(c);
      c = k ? k.parent : null;
    }
    for (var i = 0; i < chain.length; i++) {
      var cl = this.getClass(chain[i]);
      if (cl.builtin) {
        if (this.isSub(chain[i], 'Throwable') && chain[i] === 'Throwable') obj.f.message = NULL;
        continue;
      }
      for (var j = 0; j < cl.fields.length; j++) {
        var f = cl.fields[j];
        if (f.mods.static) continue;
        obj.f[f.name] = this.defaultVal(f.type);
      }
    }
  };
  I.construct = function (cn, obj, args, line) {
    var cls = this.getClass(cn);
    if (cls.builtin) {
      if (cn === 'Object') return;
      if (this.isSub(cn, 'Throwable')) {
        if (args.length >= 1 && args[0].t === 'String') obj.f.message = args[0];
        else if (args.length >= 1 && args[0].t === 'null') obj.f.message = NULL;
        else if (args.length === 0) obj.f.message = NULL;
        else obj.f.message = Sv(this.toStr(args[0]));
      }
      return;
    }
    var ctor = null;
    for (var i = 0; i < cls.ctors.length; i++)
      if (cls.ctors[i].params.length === args.length) {
        ctor = cls.ctors[i];
        break;
      }
    if (!ctor) {
      if (cls.ctors.length === 0 && args.length === 0) {
        this.construct(cls.parent || 'Object', obj, [], line);
        this.runFieldInits(cls, obj);
        return;
      }
      this.cerr(line, 'no existe un constructor de ' + cn + ' con ' + args.length + ' argumento(s)');
    }
    var fr = this.newFrame(cn, obj, 'void');
    for (var p = 0; p < ctor.params.length; p++)
      fr.scopes[0].set(ctor.params[p].name, {
        type: ctor.params[p].type,
        val: this.convert(args[p], ctor.params[p].type, null, line),
        fin: false
      });
    var stmts = ctor.body.stmts,
      start = 0;
    if (stmts.length && stmts[0].k === 'superctor') {
      this.construct(cls.parent || 'Object', obj, this.evalArgs(stmts[0].args, fr), line);
      start = 1;
    } else this.construct(cls.parent || 'Object', obj, [], line);
    this.runFieldInits(cls, obj);
    fr.scopes.push(new Map());
    for (var s = start; s < stmts.length; s++) {
      var c = this.exec(stmts[s], fr);
      if (c && c.c === 'return') break;
    }
  };
  I.runFieldInits = function (cls, obj) {
    var fr = this.newFrame(cls.name, obj, 'void');
    for (var j = 0; j < cls.fields.length; j++) {
      var f = cls.fields[j];
      if (f.mods.static || !f.init) continue;
      obj.f[f.name] = this.convert(this.ev(f.init, fr), f.type, f.init, cls.line);
    }
  };

  /* ---- expresiones ---- */
  I.className = function (n, fr) {
    if (n.k === 'id' && !this.lookup(fr, n.name) && !this.findFieldFor(fr, n.name)) {
      if (STATIC[n.name] || this.classes[n.name] || n.name === 'System') return n.name;
    }
    return null;
  };
  I.findFieldFor = function (fr, name) {
    if (fr.thisObj && fr.thisObj.f && name in fr.thisObj.f) return true;
    return !!this.findStaticField(fr.cls, name);
  };
  I.findStaticField = function (cn, name) {
    var r = this.findField(cn, name);
    return r && r.f.mods.static ? r : null;
  };
  I.staticStore = function (c) {
    return c.statics || (c.statics = {});
  };

  I.ev = function (n, fr) {
    switch (n.k) {
      case 'lit':
        return n.val;
      case 'paren':
        return this.ev(n.expr, fr);
      case 'id': {
        var e = this.lookup(fr, n.name);
        if (e) {
          if (e.val === undefined)
            this.cerr(
              n.line,
              'la variable ' + n.name + ' puede no haber sido inicializada (dale un valor antes de usarla)'
            );
          return e.val;
        }
        if (fr.thisObj && fr.thisObj.f && n.name in fr.thisObj.f) return fr.thisObj.f[n.name];
        var sf = this.findStaticField(fr.cls, n.name);
        if (sf) return this.getStatic(sf, n.line);
        this.cerr(
          n.line,
          'no se encuentra el símbolo: ' +
            n.name +
            ' (¿está declarada la variable y bien escrita? Java distingue mayúsculas)'
        );
        break;
      }
      case 'this':
        return fr.thisObj || this.cerr(n.line, "no se puede usar 'this' en un contexto estático");
      case 'unary': {
        var v = this.ev(n.expr, fr);
        if (n.op === '!') {
          if (v.t !== 'boolean') this.cerr(n.line, "el operador '!' solo se aplica a boolean");
          return Bv(!v.v);
        }
        if (!isNum(v.t))
          this.cerr(n.line, "el operador '" + n.op + "' no se puede aplicar a " + this.typeName(v));
        if (n.op === '+') return v.t === 'byte' || v.t === 'short' || v.t === 'char' ? Iv(v.v) : v;
        if (n.op === '~') {
          if (v.t === 'long') return { t: 'long', v: BigInt.asIntN(64, ~v.v) };
          if (v.t === 'float' || v.t === 'double') this.cerr(n.line, "'~' no se aplica a decimales");
          return Iv(~v.v);
        }
        if (v.t === 'long') return { t: 'long', v: BigInt.asIntN(64, -v.v) };
        if (v.t === 'double' || v.t === 'float') return { t: v.t, v: -v.v };
        return Iv(-v.v);
      }
      case 'bin': {
        var a = this.ev(n.a, fr),
          b = this.ev(n.b, fr);
        return this.binop(n.op, a, b, n.line);
      }
      case 'logic': {
        var l = this.ev(n.a, fr);
        if (l.t !== 'boolean') this.cerr(n.line, "el operador '" + n.op + "' necesita valores boolean");
        if (n.op === '&&' && !l.v) return Bv(false);
        if (n.op === '||' && l.v) return Bv(true);
        var r = this.ev(n.b, fr);
        if (r.t !== 'boolean') this.cerr(n.line, "el operador '" + n.op + "' necesita valores boolean");
        return Bv(r.v);
      }
      case 'cond': {
        var c = this.ev(n.cond, fr);
        if (c.t !== 'boolean') this.cerr(n.line, 'la condición del ? : debe ser boolean');
        var x = this.ev(c.v ? n.a : n.b, fr);
        return x;
      }
      case 'cast': {
        var cv = this.ev(n.expr, fr);
        if (n.type === 'boolean') {
          if (cv.t !== 'boolean') this.cerr(n.line, 'no se puede convertir ' + cv.t + ' a boolean');
          return cv;
        }
        if (!isNum(cv.t)) this.cerr(n.line, 'no se puede convertir ' + this.typeName(cv) + ' a ' + n.type);
        return castNum(cv, n.type);
      }
      case 'assign':
        return this.evAssign(n, fr);
      case 'incdec':
        return this.evIncDec(n, fr);
      case 'field':
        return this.evField(n, fr);
      case 'call':
        return this.evCall(n, fr);
      case 'mcall':
        return this.evMcall(n, fr);
      case 'new':
        return this.evNew(n, fr);
      case 'instanceof': {
        var iv = this.ev(n.expr, fr);
        return Bv(iv.t === 'obj' && this.isSub(iv.cls, n.type));
      }
      case 'switch':
        return this.evSwitch(n, fr);
    }
    this.cerr(n.line, 'expresión no soportada: ' + n.k);
  };

  I.getStatic = function (sf, line) {
    var st = this.staticStore(sf.cls);
    if (!(sf.f.name in st)) {
      st[sf.f.name] = sf.f.init
        ? this.convert(
            this.ev(sf.f.init, this.newFrame(sf.cls.name, null, 'void')),
            sf.f.type,
            sf.f.init,
            line
          )
        : this.defaultVal(sf.f.type);
    }
    return st[sf.f.name];
  };

  I.ref = function (t, fr) {
    var self = this;
    if (t.k === 'id') {
      var e = this.lookup(fr, t.name);
      if (e)
        return {
          type: e.type,
          fin: e.fin,
          get: function () {
            if (e.val === undefined)
              self.cerr(t.line, 'la variable ' + t.name + ' puede no haber sido inicializada');
            return e.val;
          },
          set: function (v) {
            e.val = v;
          },
          init: e.val === undefined,
          local: true
        };
      if (fr.thisObj && fr.thisObj.f && t.name in fr.thisObj.f) {
        var ff = this.findField(fr.thisObj.cls, t.name),
          o = fr.thisObj;
        return {
          type: ff ? ff.f.type : 'var',
          fin: false,
          get: function () {
            return o.f[t.name];
          },
          set: function (v) {
            o.f[t.name] = v;
          }
        };
      }
      var sf = this.findStaticField(fr.cls, t.name);
      if (sf) {
        var st = this.staticStore(sf.cls);
        this.getStatic(sf, t.line);
        return {
          type: sf.f.type,
          fin: sf.f.mods.final,
          get: function () {
            return st[t.name];
          },
          set: function (v) {
            st[t.name] = v;
          }
        };
      }
      this.cerr(
        t.line,
        'no se encuentra el símbolo: ' +
          t.name +
          ' (¿está declarada la variable y bien escrita? Java distingue mayúsculas)'
      );
    }
    if (t.k === 'field') {
      var cn = this.className(t.obj, fr);
      if (cn && this.classes[cn]) {
        var sf2 = this.findStaticField(cn, t.name);
        if (!sf2) this.cerr(t.line, 'no existe el campo estático ' + cn + '.' + t.name);
        var st2 = this.staticStore(sf2.cls);
        this.getStatic(sf2, t.line);
        return {
          type: sf2.f.type,
          fin: sf2.f.mods.final,
          get: function () {
            return st2[t.name];
          },
          set: function (v) {
            st2[t.name] = v;
          }
        };
      }
      var ov = this.ev(t.obj, fr);
      if (ov.t !== 'obj') this.cerr(t.line, 'no se puede acceder al campo ' + t.name);
      var ff2 = this.findField(ov.cls, t.name);
      if (!ff2) this.cerr(t.line, 'no existe el campo ' + t.name + ' en ' + ov.cls);
      return {
        type: ff2.f.type,
        fin: false,
        get: function () {
          return ov.f[t.name];
        },
        set: function (v) {
          ov.f[t.name] = v;
        }
      };
    }
    this.cerr(t.line, 'asignación no válida');
  };

  I.evAssign = function (n, fr) {
    var r = this.ref(n.target, fr);
    if (r.fin && !(r.local && r.init))
      this.cerr(
        n.line,
        'no se puede cambiar el valor de la constante/variable final ' + (n.target.name || '')
      );
    var rhs = this.ev(n.expr, fr),
      val;
    if (n.op === '=') val = this.convert(rhs, r.type === 'var' ? rhs.t : r.type, n.expr, n.line);
    else {
      var cur = r.get(),
        op = n.op.slice(0, -1),
        res = this.binop(op, cur, rhs, n.line);
      if (r.type === 'String') val = res;
      else if (r.type === 'boolean') val = res;
      else if (isNum(r.type) && isNum(res.t)) val = castNum(res, r.type);
      else val = this.convert(res, r.type, null, n.line);
    }
    if (r.local && r.init) r.init = false;
    r.set(val);
    return val;
  };
  I.evIncDec = function (n, fr) {
    var r = this.ref(n.target, fr);
    if (r.fin) this.cerr(n.line, 'no se puede cambiar el valor de una constante (final)');
    var old = r.get();
    if (!isNum(old.t)) this.cerr(n.line, "'" + n.op + "' solo se puede usar con números");
    var one = { t: 'int', v: 1 };
    var res = this.arith(n.op === '++' ? '+' : '-', old, one, n.line);
    var nv = castNum(res, old.t);
    r.set(nv);
    return n.prefix ? nv : old;
  };

  var STATIC = {
    Math: 1,
    Integer: 1,
    Double: 1,
    Long: 1,
    Byte: 1,
    Short: 1,
    Float: 1,
    Character: 1,
    String: 1,
    Boolean: 1,
    System: 1,
    LocalTime: 1
  };
  I.evField = function (n, fr) {
    var cn = this.className(n.obj, fr);
    if (cn) {
      var c = this.classes[cn];
      if (c) {
        var sf = this.findStaticField(cn, n.name);
        if (sf) return this.getStatic(sf, n.line);
        this.cerr(n.line, 'no existe el campo estático ' + cn + '.' + n.name);
      }
      if (cn === 'System') {
        if (n.name === 'out') return { t: 'out' };
        if (n.name === 'in') return { t: 'in' };
        if (n.name === 'err') return { t: 'err' };
      }
      if (cn === 'Math') {
        if (n.name === 'PI') return { t: 'double', v: Math.PI };
        if (n.name === 'E') return { t: 'double', v: Math.E };
      }
      var K = {
        Integer: { MAX_VALUE: { t: 'int', v: 2147483647 }, MIN_VALUE: { t: 'int', v: -2147483648 } },
        Long: {
          MAX_VALUE: { t: 'long', v: 9223372036854775807n },
          MIN_VALUE: { t: 'long', v: -9223372036854775808n }
        },
        Byte: { MAX_VALUE: { t: 'byte', v: 127 }, MIN_VALUE: { t: 'byte', v: -128 } },
        Short: { MAX_VALUE: { t: 'short', v: 32767 }, MIN_VALUE: { t: 'short', v: -32768 } },
        Double: { MAX_VALUE: { t: 'double', v: Number.MAX_VALUE }, MIN_VALUE: { t: 'double', v: 5e-324 } },
        Float: {
          MAX_VALUE: { t: 'float', v: 3.4028234663852886e38 },
          MIN_VALUE: { t: 'float', v: 1.401298464324817e-45 }
        }
      };
      if (K[cn] && K[cn][n.name]) return K[cn][n.name];
      this.cerr(n.line, 'no se encuentra el símbolo: ' + cn + '.' + n.name);
    }
    var o = this.ev(n.obj, fr);
    if (o.t === 'obj' && n.name in o.f) return o.f[n.name];
    this.cerr(
      n.line,
      'no se encuentra el símbolo: ' +
        n.name +
        (o.t === 'String' ? ' (para la longitud de un String se usa length())' : '')
    );
  };

  I.evNew = function (n, fr) {
    var args = this.evalArgs(n.args, fr);
    if (n.cls === 'Scanner') return { t: 'scanner', s: this.scanner };
    if (n.cls === 'String') return Sv(args.length ? this.toStr(args[0]) : '');
    if (n.cls === 'Object') return { t: 'obj', cls: 'Object', f: {} };
    return this.instantiate(n.cls, args, n.line);
  };

  I.evCall = function (n, fr) {
    var args = this.evalArgs(n.args, fr);
    var found = null,
      cn = fr.cls;
    var cands = [];
    while (cn) {
      var c = this.getClass(cn);
      if (!c) break;
      for (var i = 0; i < c.methods.length; i++)
        if (c.methods[i].name === n.name && c.methods[i].params.length === args.length)
          cands.push({ cls: c, m: c.methods[i] });
      cn = c.parent;
    }
    if (!cands.length) {
      var any = this.findMethod(fr.cls, n.name, -1);
      if (any)
        this.cerr(
          n.line,
          'el método ' +
            n.name +
            ' espera ' +
            any.m.params.length +
            ' argumento(s), pero le pasas ' +
            args.length
        );
      this.cerr(n.line, 'no se encuentra el método ' + n.name + '(...)');
    }
    found = cands[0];
    if (cands.length > 1) {
      for (var k = 0; k < cands.length; k++) {
        var ok = true,
          m = cands[k].m;
        for (var j = 0; j < args.length; j++) {
          try {
            this.convert(args[j], m.params[j].type, null, n.line);
          } catch (e) {
            if (e instanceof CompileError) {
              ok = false;
              break;
            }
            throw e;
          }
        }
        if (ok) {
          found = cands[k];
          break;
        }
      }
    }
    if (!found.m.mods.static && !fr.thisObj)
      this.cerr(
        n.line,
        'el método ' +
          n.name +
          ' no es static y se llama desde un contexto estático (añade static o usa un objeto)'
      );
    return this.callMethod(found.cls.name, found.m, found.m.mods.static ? null : fr.thisObj, args, n.line);
  };

  I.evMcall = function (n, fr) {
    var cn = this.className(n.obj, fr);
    if (cn) {
      var args0 = this.evalArgs(n.args, fr);
      var uc = this.classes[cn];
      if (uc) {
        var mm = this.findMethod(cn, n.name, args0.length);
        if (!mm) this.cerr(n.line, 'no se encuentra el método ' + cn + '.' + n.name);
        return this.callMethod(mm.cls.name, mm.m, null, args0, n.line);
      }
      return this.callBuiltinStatic(cn, n.name, args0, n.line);
    }
    var o = this.ev(n.obj, fr),
      args = this.evalArgs(n.args, fr);
    switch (o.t) {
      case 'out':
      case 'err':
        return this.callOut(o, n.name, args, n.line);
      case 'scanner':
        return this.callScanner(o, n.name, args, n.line);
      case 'String':
        return this.callString(o, n.name, args, n.line);
      case 'obj':
        return this.callObj(o, n.name, args, n.line);
      case 'null':
        this.jthrow('NullPointerException', 'no se puede llamar a ' + n.name + '() porque el valor es null');
    }
    this.cerr(
      n.line,
      'no se puede llamar al método ' + n.name + ' sobre un valor de tipo ' + this.typeName(o)
    );
  };

  I.callOut = function (o, name, args, line) {
    var isErr = o.t === 'err';
    if (name === 'println') {
      this.write((args.length ? this.toStr(args[0]) : '') + '\n', isErr);
      return NULL;
    }
    if (name === 'print') {
      if (!args.length) this.cerr(line, 'print necesita un argumento');
      this.write(this.toStr(args[0]), isErr);
      return NULL;
    }
    if (name === 'printf' || name === 'format') {
      this.write(this.jformat(args, line), isErr);
      return NULL;
    }
    this.cerr(line, 'System.out no tiene el método ' + name);
  };

  var WS = /\s/;
  I.callScanner = function (o, name, args, line) {
    var sc = o.s;
    function skipWs() {
      while (sc.p < sc.s.length && WS.test(sc.s[sc.p])) sc.p++;
    }
    function peekTok() {
      var p = sc.p;
      while (p < sc.s.length && WS.test(sc.s[p])) p++;
      if (p >= sc.s.length) return null;
      var e = p;
      while (e < sc.s.length && !WS.test(sc.s[e])) e++;
      return { tok: sc.s.slice(p, e), end: e };
    }
    var self = this;
    function touch(p) {
      if (!self.opts.interactive) return;
      var L = 0,
        i = -1;
      while ((i = sc.s.indexOf('\n', i + 1)) >= 0 && i < p) L++;
      if (self.echoAt[L] === undefined) self.echoAt[L] = self.outLen;
    }
    function wait() {
      if (self.opts.interactive) throw new Wait();
    }
    function need() {
      var t = peekTok();
      if (!t) {
        wait();
        self.jthrow('NoSuchElementException', null);
      }
      touch(t.end - t.tok.length);
      return t;
    }
    switch (name) {
      case 'nextLine': {
        if (sc.p >= sc.s.length) {
          wait();
          this.jthrow('NoSuchElementException', 'No line found');
        }
        touch(sc.p);
        var idx = sc.s.indexOf('\n', sc.p),
          line_;
        if (idx < 0) {
          line_ = sc.s.slice(sc.p);
          sc.p = sc.s.length;
        } else {
          line_ = sc.s.slice(sc.p, idx);
          sc.p = idx + 1;
        }
        return Sv(line_.replace(/\r$/, ''));
      }
      case 'next': {
        var t = need();
        sc.p = t.end;
        return Sv(t.tok);
      }
      case 'nextInt':
      case 'nextLong':
      case 'nextShort':
      case 'nextByte': {
        var t2 = need();
        if (!/^[+-]?\d+$/.test(t2.tok))
          this.jthrow('InputMismatchException', 'For input string: "' + t2.tok + '"');
        var big = BigInt(t2.tok);
        if (name === 'nextInt' && (big > 2147483647n || big < -2147483648n))
          this.jthrow('InputMismatchException', 'For input string: "' + t2.tok + '"');
        sc.p = t2.end;
        return name === 'nextLong' ? { t: 'long', v: big } : Iv(Number(big));
      }
      case 'nextDouble':
      case 'nextFloat': {
        var t3 = need();
        if (!/^[+-]?(\d+([.,]\d*)?|[.,]\d+)([eE][+-]?\d+)?$/.test(t3.tok))
          this.jthrow('InputMismatchException', 'For input string: "' + t3.tok + '"');
        sc.p = t3.end;
        var dv = parseFloat(t3.tok.replace(',', '.'));
        return name === 'nextFloat' ? { t: 'float', v: Math.fround(dv) } : { t: 'double', v: dv };
      }
      case 'nextBoolean': {
        var t4 = need();
        if (!/^(true|false)$/i.test(t4.tok))
          this.jthrow('InputMismatchException', 'For input string: "' + t4.tok + '"');
        sc.p = t4.end;
        return Bv(/^true$/i.test(t4.tok));
      }
      case 'hasNext': {
        var hn = peekTok();
        if (!hn) wait();
        else touch(hn.end - hn.tok.length);
        return Bv(!!hn);
      }
      case 'hasNextInt': {
        var h = peekTok();
        if (!h) wait();
        else touch(h.end - h.tok.length);
        return Bv(!!h && /^[+-]?\d+$/.test(h.tok) && Math.abs(Number(h.tok)) <= 2147483648);
      }
      case 'hasNextDouble': {
        var h2 = peekTok();
        if (!h2) wait();
        else touch(h2.end - h2.tok.length);
        return Bv(!!h2 && /^[+-]?(\d+([.,]\d*)?|[.,]\d+)([eE][+-]?\d+)?$/.test(h2.tok));
      }
      case 'hasNextLine':
        if (sc.p >= sc.s.length) wait();
        else touch(sc.p);
        return Bv(sc.p < sc.s.length);
      case 'close':
        return NULL;
    }
    this.cerr(line, 'Scanner no tiene el método ' + name);
  };

  I.callString = function (o, name, args, line) {
    var s = o.v;
    function idx(v) {
      return v.v;
    }
    switch (name) {
      case 'length':
        return Iv(s.length);
      case 'charAt': {
        var i = args[0].v;
        if (i < 0 || i >= s.length)
          this.jthrow(
            'StringIndexOutOfBoundsException',
            'Index ' + i + ' out of bounds for length ' + s.length
          );
        return { t: 'char', v: s.charCodeAt(i) };
      }
      case 'isEmpty':
        return Bv(s.length === 0);
      case 'toUpperCase':
        return Sv(s.toUpperCase());
      case 'toLowerCase':
        return Sv(s.toLowerCase());
      case 'trim':
        return Sv(s.trim());
      case 'equals':
        return Bv(args[0].t === 'String' && args[0].v === s);
      case 'equalsIgnoreCase':
        return Bv(args[0].t === 'String' && args[0].v.toLowerCase() === s.toLowerCase());
      case 'contains':
        return Bv(s.indexOf(this.toStr(args[0])) >= 0);
      case 'indexOf':
        return Iv(s.indexOf(args[0].t === 'char' ? String.fromCharCode(args[0].v) : this.toStr(args[0])));
      case 'startsWith':
        return Bv(s.startsWith(this.toStr(args[0])));
      case 'endsWith':
        return Bv(s.endsWith(this.toStr(args[0])));
      case 'concat':
        return Sv(s + this.toStr(args[0]));
      case 'replace':
        return Sv(s.split(this.toStr(args[0])).join(this.toStr(args[1])));
      case 'compareTo': {
        var t = args[0].v;
        var n = Math.min(s.length, t.length);
        for (var i2 = 0; i2 < n; i2++) if (s[i2] !== t[i2]) return Iv(s.charCodeAt(i2) - t.charCodeAt(i2));
        return Iv(s.length - t.length);
      }
      case 'substring': {
        var a = args[0].v,
          b = args.length > 1 ? args[1].v : s.length;
        if (a < 0 || b > s.length || a > b)
          this.jthrow(
            'StringIndexOutOfBoundsException',
            'begin ' + a + ', end ' + b + ', length ' + s.length
          );
        return Sv(s.substring(a, b));
      }
      case 'toString':
        return o;
    }
    this.cerr(line, 'String no tiene el método ' + name + ' (en este laboratorio)');
  };

  I.callObj = function (o, name, args, line) {
    var m = this.findMethod(o.cls, name, args.length);
    if (m) return this.callMethod(m.cls.name, m.m, o, args, line);
    if (this.isSub(o.cls, 'Throwable')) {
      if (name === 'getMessage' || name === 'getLocalizedMessage') return o.f.message || NULL;
      if (name === 'toString') return Sv(this.toStr(o));
      if (name === 'printStackTrace') {
        this.write(this.toStr(o) + '\n\tat Main.main(Main.java)\n', true);
        return NULL;
      }
    }
    if (name === 'toString') return Sv(this.toStr(o));
    if (name === 'equals') return Bv(o === args[0]);
    this.cerr(line, 'no se encuentra el método ' + name + ' en la clase ' + o.cls);
  };

  /* String.format / printf (idioma español: coma decimal) */
  I.jformat = function (args, line) {
    var self = this;
    if (!args.length || args[0].t !== 'String')
      this.cerr(line, 'printf / String.format necesita primero el texto de formato');
    var fm = args[0].v,
      ai = 1;
    return fm.replace(/%([-0+ ,]*)(\d+)?(?:\.(\d+))?([a-zA-Z%])/g, function (all, fl, w, pr, c) {
      if (c === 'n') return '\n';
      if (c === '%') return '%';
      if (ai >= args.length) self.jthrow('MissingFormatArgumentException', "Format specifier '" + all + "'");
      var a = args[ai++],
        out;
      if (c === 'd') {
        if (!(a.t === 'int' || a.t === 'long'))
          self.jthrow(
            'IllegalFormatConversionException',
            'd != ' + (a.t === 'double' ? 'java.lang.Double' : a.t)
          );
        out = String(a.v);
        var neg = out[0] === '-';
        if (neg) out = out.slice(1);
        if (fl.indexOf(',') >= 0) out = out.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        out = (neg ? '-' : fl.indexOf('+') >= 0 ? '+' : '') + out;
      } else if (c === 'f') {
        if (!(a.t === 'double' || a.t === 'float'))
          self.jthrow(
            'IllegalFormatConversionException',
            'f != ' + (a.t === 'int' ? 'java.lang.Integer' : a.t)
          );
        var p = pr == null ? 6 : +pr;
        var v = Number(a.v);
        out = (Math.round(Math.abs(v) * Math.pow(10, p) + 1e-9 * 0) / Math.pow(10, p)).toFixed(p);
        var neg2 = v < 0 && Number(out) !== 0;
        var parts = out.split('.');
        if (fl.indexOf(',') >= 0) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        out = (neg2 ? '-' : fl.indexOf('+') >= 0 ? '+' : '') + parts.join(',');
      } else if (c === 's' || c === 'S') {
        out = self.toStr(a);
        if (c === 'S') out = out.toUpperCase();
      } else if (c === 'c')
        out = a.t === 'char' ? String.fromCharCode(a.v) : String.fromCharCode(Number(a.v));
      else if (c === 'b') out = String(a.t === 'boolean' ? a.v : a.t !== 'null');
      else self.jthrow('UnknownFormatConversionException', "Conversion = '" + c + "'");
      if (w) {
        var W = +w;
        if (out.length < W)
          out =
            fl.indexOf('-') >= 0
              ? out + ' '.repeat(W - out.length)
              : fl.indexOf('0') >= 0 && /^[+-]?\d/.test(out)
                ? /^[+-]/.test(out)
                  ? out[0] + '0'.repeat(W - out.length) + out.slice(1)
                  : '0'.repeat(W - out.length) + out
                : ' '.repeat(W - out.length) + out;
      }
      return out;
    });
  };

  I.callBuiltinStatic = function (cn, name, args, line) {
    var self = this;
    function num(i) {
      if (!args[i] || !isNum(args[i].t)) self.cerr(line, cn + '.' + name + ' necesita un número');
      return args[i];
    }
    if (cn === 'Math') {
      switch (name) {
        case 'abs': {
          var a = num(0);
          if (a.t === 'long') return { t: 'long', v: a.v < 0n ? BigInt.asIntN(64, -a.v) : a.v };
          if (a.t === 'double' || a.t === 'float') return { t: a.t, v: Math.abs(a.v) };
          return Iv(Math.abs(a.v));
        }
        case 'sqrt':
          return { t: 'double', v: Math.sqrt(toNumber(num(0))) };
        case 'cbrt':
          return { t: 'double', v: Math.cbrt(toNumber(num(0))) };
        case 'pow':
          return { t: 'double', v: Math.pow(toNumber(num(0)), toNumber(num(1))) };
        case 'sin':
          return { t: 'double', v: Math.sin(toNumber(num(0))) };
        case 'cos':
          return { t: 'double', v: Math.cos(toNumber(num(0))) };
        case 'tan':
          return { t: 'double', v: Math.tan(toNumber(num(0))) };
        case 'exp':
          return { t: 'double', v: Math.exp(toNumber(num(0))) };
        case 'log':
          return { t: 'double', v: Math.log(toNumber(num(0))) };
        case 'log10':
          return { t: 'double', v: Math.log10(toNumber(num(0))) };
        case 'floor':
          return { t: 'double', v: Math.floor(toNumber(num(0))) };
        case 'ceil':
          return { t: 'double', v: Math.ceil(toNumber(num(0))) };
        case 'random':
          return { t: 'double', v: this.opts.random ? this.opts.random() : Math.random() };
        case 'round': {
          var r = num(0);
          if (r.t === 'float') return Iv(d2i(Math.floor(r.v + 0.5)));
          if (r.t === 'double') return { t: 'long', v: toLong({ t: 'double', v: Math.floor(r.v + 0.5) }) };
          return r;
        }
        case 'max':
        case 'min': {
          var x = num(0),
            y = num(1),
            t = promote(x.t, y.t),
            res;
          var cx = castNum(x, t),
            cy = castNum(y, t);
          if (t === 'long') res = (name === 'max' ? cx.v > cy.v : cx.v < cy.v) ? cx : cy;
          else res = (name === 'max' ? cx.v > cy.v : cx.v < cy.v) ? cx : cy;
          return res;
        }
      }
    }
    if (cn === 'Integer') {
      if (name === 'parseInt' || name === 'valueOf') {
        var sv = args[0];
        if (sv.t === 'int') return sv;
        if (sv.t !== 'String') this.cerr(line, 'Integer.parseInt necesita un String');
        if (!/^[+-]?\d+$/.test(sv.v.trim() === sv.v ? sv.v : '#') || Math.abs(Number(sv.v)) > 2147483648)
          this.jthrow('NumberFormatException', 'For input string: "' + sv.v + '"');
        var pv = Number(sv.v);
        if (pv > 2147483647 || pv < -2147483648)
          this.jthrow('NumberFormatException', 'For input string: "' + sv.v + '"');
        return Iv(pv);
      }
      if (name === 'toString') return Sv(this.toStr(args[0]));
    }
    if (cn === 'Double' && (name === 'parseDouble' || name === 'valueOf')) {
      var ds = args[0];
      if (isNum(ds.t)) return { t: 'double', v: toNumber(ds) };
      if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(ds.v.trim()))
        this.jthrow('NumberFormatException', 'For input string: "' + ds.v + '"');
      return { t: 'double', v: parseFloat(ds.v) };
    }
    if (cn === 'String' && name === 'valueOf') return Sv(this.toStr(args[0]));
    if (cn === 'String' && name === 'format') return Sv(this.jformat(args, line));
    if ((cn === 'LocalTime' || cn === 'java.time.LocalTime') && name === 'now') {
      var dt = new Date();
      var pz = function (x, n) {
        return String(x).padStart(n || 2, '0');
      };
      return Sv(
        pz(dt.getHours()) +
          ':' +
          pz(dt.getMinutes()) +
          ':' +
          pz(dt.getSeconds()) +
          '.' +
          pz(dt.getMilliseconds(), 3)
      );
    }
    if (cn === 'Character') {
      var ch = args[0],
        code = ch.v;
      if (name === 'isDigit') return Bv(code >= 48 && code <= 57);
      if (name === 'isLetter') return Bv(/\p{L}/u.test(String.fromCharCode(code)));
      if (name === 'isUpperCase') return Bv(code >= 65 && code <= 90);
      if (name === 'isLowerCase') return Bv(code >= 97 && code <= 122);
      if (name === 'toUpperCase')
        return { t: 'char', v: String.fromCharCode(code).toUpperCase().charCodeAt(0) };
      if (name === 'toLowerCase')
        return { t: 'char', v: String.fromCharCode(code).toLowerCase().charCodeAt(0) };
    }
    if (cn === 'System' && name === 'exit') throw new Exit(args.length ? args[0].v : 0);
    if (cn === 'System' && name === 'currentTimeMillis') return { t: 'long', v: BigInt(Date.now()) };
    this.cerr(line, 'no se encuentra el método ' + cn + '.' + name + ' (en este laboratorio)');
  };

  /* ---- switch ---- */
  I.evSwitch = function (n, fr) {
    var sv = this.ev(n.expr, fr);
    if (!(isNum(sv.t) && sv.t !== 'long' && sv.t !== 'float' && sv.t !== 'double') && sv.t !== 'String')
      this.cerr(
        n.line,
        'el switch solo admite int, char, byte, short o String (no ' + this.typeName(sv) + ')'
      );
    var start = -1,
      def = -1;
    for (var i = 0; i < n.cases.length && start < 0; i++) {
      var cs = n.cases[i];
      if (!cs.labels) {
        def = i;
        continue;
      }
      for (var j = 0; j < cs.labels.length; j++) {
        var lv = this.ev(cs.labels[j], fr);
        if (sv.t === 'String' ? lv.t === 'String' && lv.v === sv.v : isNum(lv.t) && lv.v === sv.v) {
          start = i;
          break;
        }
      }
    }
    if (start < 0) start = def;
    var result = NULL;
    if (start < 0) {
      if (n.isExpr) this.cerr(n.line, 'el switch como expresión debe cubrir todos los casos (añade default)');
      return NULL;
    }
    if (n.arrow) {
      var body = n.cases[start].body;
      fr.scopes.push(new Map());
      try {
        if (body.k === 'expr') {
          var v = this.ev(body.expr, fr);
          result = v;
        } else {
          var c = this.exec(body, fr);
          if (c && !n.isExpr) {
            if (c.c === 'break') c = null;
            else {
              fr.scopes.pop();
              fr.__sig = c;
              return NULL;
            }
          }
        }
      } finally {
        if (fr.scopes.length) {
          /* se limpia abajo */
        }
      }
      fr.scopes.pop();
      return result;
    }
    fr.scopes.push(new Map());
    var sig = null;
    for (var k = start; k < n.cases.length && !sig; k++) {
      var stmts = n.cases[k].body;
      for (var s = 0; s < stmts.length; s++) {
        var cc = this.exec(stmts[s], fr);
        if (cc) {
          sig = cc;
          break;
        }
      }
    }
    fr.scopes.pop();
    if (sig && sig.c !== 'break') fr.__sig = sig;
    return NULL;
  };

  /* ---- sentencias ---- */
  I.cond = function (n, fr) {
    var c = this.ev(n, fr);
    if (c.t !== 'boolean')
      this.cerr(n.line, 'la condición debe ser boolean (aquí es ' + this.typeName(c) + ')');
    return c.v;
  };
  I.execBlock = function (b, fr, noScope) {
    if (!noScope) fr.scopes.push(new Map());
    var c = null;
    try {
      for (var i = 0; i < b.stmts.length; i++) {
        c = this.exec(b.stmts[i], fr);
        if (c) break;
      }
    } finally {
      if (!noScope) fr.scopes.pop();
    }
    return c;
  };
  I.exec = function (s, fr) {
    this.tick();
    switch (s.k) {
      case 'block':
        return this.execBlock(s, fr);
      case 'empty':
        return null;
      case 'decl': {
        for (var i = 0; i < s.decls.length; i++) {
          var d = s.decls[i],
            val = undefined;
          if (d.init) {
            var iv = this.ev(d.init, fr);
            if (s.type === 'var') val = iv;
            else val = this.convert(iv, s.type, d.init, s.line);
          }
          this.declare(fr, d.name, s.type === 'var' ? val.t : s.type, val, s.fin, s.line);
        }
        return null;
      }
      case 'expr': {
        this.ev(s.expr, fr);
        if (fr.__sig) {
          var sg = fr.__sig;
          fr.__sig = null;
          return sg;
        }
        return null;
      }
      case 'if': {
        var r = this.cond(s.cond, fr);
        if (r) return this.exec(s.then, fr);
        if (s.els) return this.exec(s.els, fr);
        return null;
      }
      case 'while': {
        while (this.cond(s.cond, fr)) {
          this.tick();
          var c = this.exec(s.body, fr);
          if (c) {
            if (c.c === 'break') break;
            if (c.c === 'continue') continue;
            return c;
          }
        }
        return null;
      }
      case 'dowhile': {
        do {
          this.tick();
          var c2 = this.exec(s.body, fr);
          if (c2) {
            if (c2.c === 'break') break;
            if (c2.c === 'continue') {
              if (!this.cond(s.cond, fr)) break;
              continue;
            }
            return c2;
          }
        } while (this.cond(s.cond, fr));
        return null;
      }
      case 'for': {
        fr.scopes.push(new Map());
        try {
          for (var k = 0; k < s.init.length; k++) this.exec(s.init[k], fr);
          while (s.cond ? this.cond(s.cond, fr) : true) {
            this.tick();
            var c3 = this.exec(s.body, fr);
            if (c3) {
              if (c3.c === 'break') break;
              if (c3.c !== 'continue') return c3;
            }
            for (var u = 0; u < s.upd.length; u++) this.ev(s.upd[u], fr);
          }
        } finally {
          fr.scopes.pop();
        }
        return null;
      }
      case 'switch': {
        this.evSwitch(s, fr);
        if (fr.__sig) {
          var sg2 = fr.__sig;
          fr.__sig = null;
          return sg2;
        }
        return null;
      }
      case 'return': {
        if (s.expr) {
          if (fr.retType === 'void') this.cerr(s.line, 'un método void no puede devolver un valor');
          var rv = this.ev(s.expr, fr);
          return {
            c: 'return',
            v: fr.retType && fr.retType !== 'void' ? this.convert(rv, fr.retType, s.expr, s.line) : rv
          };
        }
        if (fr.retType && fr.retType !== 'void')
          this.cerr(s.line, 'este método debe devolver un valor de tipo ' + fr.retType);
        return { c: 'return', v: null };
      }
      case 'break':
        return { c: 'break' };
      case 'continue':
        return { c: 'continue' };
      case 'throw': {
        var tv = this.ev(s.expr, fr);
        if (tv.t === 'null') this.jthrow('NullPointerException', null);
        if (tv.t !== 'obj' || !this.isSub(tv.cls, 'Throwable'))
          this.cerr(
            s.line,
            'solo se pueden lanzar objetos de tipo Throwable (Exception, RuntimeException...)'
          );
        throw new JThrow(tv);
      }
      case 'assert': {
        if (this.ea) {
          if (!this.cond(s.cond, fr)) {
            var m = s.msg ? this.toStr(this.ev(s.msg, fr)) : null;
            throw new JThrow(this.mkThrowable('AssertionError', m));
          }
        }
        return null;
      }
      case 'try':
        return this.execTry(s, fr);
      case 'superctor':
        this.cerr(s.line, 'super(...) solo puede ir en la primera línea de un constructor');
    }
    this.cerr(s.line, 'instrucción no soportada: ' + s.k);
  };
  I.execTry = function (s, fr) {
    var result = null,
      pending = null;
    var depthSave = this.depth,
      scopeLen = fr.scopes.length;
    try {
      result = this.exec(s.block, fr);
    } catch (e) {
      if (e instanceof JThrow) {
        fr.scopes.length = scopeLen;
        this.depth = depthSave;
        var handled = false;
        for (var i = 0; i < s.catches.length && !handled; i++) {
          var ct = s.catches[i];
          for (var j = 0; j < ct.types.length; j++) {
            if (!this.getClass(ct.types[j]))
              this.cerr(s.line, 'no se encuentra la clase de excepción ' + ct.types[j]);
            if (this.isSub(e.obj.cls, ct.types[j])) {
              handled = true;
              fr.scopes.push(new Map());
              fr.scopes[fr.scopes.length - 1].set(ct.name, { type: ct.types[0], val: e.obj, fin: false });
              try {
                result = this.exec(ct.body, fr);
              } catch (e2) {
                if (e2 instanceof JThrow) {
                  pending = e2;
                  fr.scopes.length = scopeLen;
                } else {
                  fr.scopes.length = scopeLen;
                  throw e2;
                }
              }
              fr.scopes.length = scopeLen;
              break;
            }
          }
        }
        if (!handled) pending = e;
      } else throw e;
    }
    if (s.fin) {
      var fc = this.exec(s.fin, fr);
      if (fc) return fc;
    }
    if (pending) throw pending;
    return result;
  };

  /* ---------------- API ---------------- */
  function build(it, prog) {
    if (prog.mode === 'body') {
      var main = { name: 'Main', parent: null, fields: [], methods: [], ctors: [], line: 1 };
      it.classes.Main = main;
      return { main: main, body: prog.stmts };
    }
    var mainCls = null;
    prog.classes.forEach(function (c) {
      if (it.classes[c.name])
        throw new CompileError(c.line, 'la clase ' + c.name + ' está definida dos veces');
      it.classes[c.name] = c;
    });
    prog.classes.forEach(function (c) {
      if (c.parent && !it.getClass(c.parent))
        throw new CompileError(c.line, 'no se encuentra la clase padre ' + c.parent);
      c.methods.forEach(function (m) {
        if (m.name === 'main' && m.mods.static) mainCls = mainCls || c;
      });
    });
    if (!mainCls)
      throw new CompileError(1, 'no hay ningún método main: public static void main(String[] args)');
    return { main: mainCls, body: null };
  }

  function run(src, opts) {
    opts = opts || {};
    var it = new Interp(opts),
      res = { ok: false, out: '', err: '', compile: null, exception: null, halted: null, steps: 0 };
    try {
      var toks = lex(src.replace(/\bjava\.time\.LocalTime\b/g, 'LocalTime')),
        prog = new Parser(toks).parseProgram();
      var b = build(it, prog);
      var fr = it.newFrame(b.main.name, null, 'void');
      try {
        if (b.body) {
          fr.scopes.push(new Map());
          for (var i = 0; i < b.body.length; i++) {
            var c = it.exec(b.body[i], fr);
            if (c && c.c === 'return') break;
          }
        } else {
          var m = null;
          b.main.methods.forEach(function (mm) {
            if (mm.name === 'main' && mm.mods.static) m = mm;
          });
          it.callMethod(b.main.name, m, null, m.params.length ? [NULL] : [], m.line);
        }
        res.ok = true;
      } catch (e) {
        if (e instanceof Wait) {
          res.waiting = true;
        } else if (e instanceof JThrow) {
          res.exception =
            it.fullName(e.obj.cls) +
            (e.obj.f.message && e.obj.f.message.t !== 'null' ? ': ' + e.obj.f.message.v : '');
        } else if (e instanceof Exit) {
          res.ok = true;
        } else throw e;
      }
    } catch (e) {
      if (e instanceof CompileError) {
        res.compile = { line: e.line, msg: e.msg };
      } else if (e instanceof Halt) {
        res.halted = e.msg;
      } else if (e instanceof Wait) {
        res.waiting = true;
      } else if (e instanceof RangeError) {
        res.halted = 'Desbordamiento de pila: demasiadas llamadas anidadas (recursión infinita).';
      } else throw e;
    }
    res.out = res.compile ? '' : it.out.join('');
    if (opts.interactive && !res.compile) {
      var lines = it.scanner.s.split('\n'),
        segs = [],
        pos = 0,
        keys = Object.keys(it.echoAt)
          .map(Number)
          .sort(function (a, b) {
            return a - b;
          });
      keys.forEach(function (L) {
        var at = it.echoAt[L];
        if (at > pos) {
          segs.push({ t: 'out', s: res.out.slice(pos, at) });
          pos = at;
        }
        segs.push({ t: 'in', s: (lines[L] || '') + '\n' });
      });
      if (pos < res.out.length) segs.push({ t: 'out', s: res.out.slice(pos) });
      res.segs = segs;
    }
    res.err = it.err.join('');
    res.steps = it.steps;
    return res;
  }

  function evalExpr(src) {
    var it = new Interp({}),
      toks = lex(src);
    var p = new Parser(toks),
      e = p.parseExpr();
    if (p.peek().t !== 'eof') p.err('sobra texto después de la expresión');
    var v = it.ev(e, it.newFrame('Main', null, 'void'));
    var ty = v.t === 'obj' ? v.cls : v.t;
    return {
      type: ty,
      text: it.toStr(v),
      quoted:
        v.t === 'String'
          ? '"' + v.v + '"'
          : v.t === 'char'
            ? "'" + String.fromCharCode(v.v) + "'"
            : it.toStr(v)
    };
  }
  function safeEval(src) {
    try {
      return evalExpr(src);
    } catch (e) {
      if (e instanceof CompileError) return { error: e.msg };
      if (e instanceof JThrow)
        return {
          error:
            'Excepción: ' +
            new Interp({}).fullName(e.obj.cls) +
            (e.obj.f.message.t !== 'null' ? ': ' + e.obj.f.message.v : '')
        };
      if (e instanceof Halt) return { error: e.msg };
      return { error: 'No se pudo evaluar' };
    }
  }

  root.JavaI = { run: run, evalExpr: safeEval, jd: jd, jf: jf };
  if (typeof module !== 'undefined') module.exports = root.JavaI;
})(typeof window !== 'undefined' ? window : globalThis);
