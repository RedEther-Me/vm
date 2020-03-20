export default parser => {
  const BaseAsmVisitor = parser.getBaseCstVisitorConstructor();

  class myCustomVisitor extends BaseAsmVisitor {
    constructor() {
      super();

      this.validateVisitor();
    }

    terminate(ctx) {
      return {};
    }

    label(ctx) {
      const { LABEL } = ctx.children;

      return {
        value: { type: "address", name: LABEL[0].image },
        isLabel: true
      };
    }

    literal(ctx) {
      return [];
    }

    hex(ctx) {
      return [];
    }

    char(ctx) {
      return [];
    }

    reg_lit_hex_char_label(ctx) {
      return [];
    }

    reg_lit_hex_char(ctx) {
      return [];
    }

    lit_hex_char(ctx) {
      return [];
    }

    reg_lit(ctx) {
      return [];
    }

    reg_hex_label(ctx) {
      return [];
    }

    hex_lit(ctx) {
      return [];
    }

    reg_hex(ctx) {
      return [];
    }

    register(ctx) {
      return [];
    }

    mov(ctx) {
      return [];
    }

    load(ctx) {
      return [];
    }

    store(ctx) {
      return [];
    }

    copy(ctx) {
      return [];
    }

    push(ctx) {
      return [];
    }

    pop(ctx) {
      return [];
    }

    call(ctx) {
      return [];
    }

    ret() {
      return [];
    }

    jump(ctx) {
      return [];
    }

    arithmetic(ctx) {
      return [];
    }

    binary(ctx) {
      return [];
    }

    set_ivt(ctx) {
      return [];
    }

    statement(ctx) {
      return [];
    }

    data(ctx) {
      return [];
    }

    ascii(ctx) {
      return [];
    }

    byte(ctx) {
      return [];
    }

    space(ctx) {
      return [];
    }

    word(ctx) {
      return [];
    }

    segment(ctx) {
      return [];
    }

    method(ctx) {
      return [];
    }

    main(ctx) {
      return [];
    }

    terminate() {
      return [];
    }

    target(ctx) {
      return [];
    }

    globals(ctx) {
      const { LABEL } = ctx;
      return { type: "global", name: LABEL[0].image };
    }

    program(ctx) {
      const { globals } = ctx;

      return globals.map(g => this.visit(g));
    }
  }

  return myCustomVisitor;
};
