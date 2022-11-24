function sepBy(pattern, separator) {
  return seq(pattern, repeat(seq(separator, pattern)))
}

module.exports = grammar({
  name: 'COBOL',
  word: $ => $._WORD,

  rules: {
    start: $ => repeat(
      choice(
        $.program_definition,
        //optional($.function_definition) //todo
      )
    ),

    program_definition: $ => seq(
      $.identification_division,
      optional($.environment_division),
      optional($.data_division),
      $.procedure_division, //todo
      optional($.nested_prog), //todo
      optional($.end_program) //todo
    ),

    identification_division: $ => seq(
      $._IDENTIFICATION, $._DIVISION, '.',
      $._PROGRAM_ID, '.',
      $.program_name,
      optional($.as_literal),
      '.'
    ),

    program_name: $ => choice(
      $._WORD,
      $._LITERAL
    ),

    as_literal: $ => seq(
      $._AS,
      $._LITERAL
    ),

    function_definition: $ => /todo_function_definition/,

    environment_division: $ => seq(
      $._ENVIRONMENT,
      $._DIVISION,
      optional($.configuration_section),
      optional($.input_output_section),
    ),

    configuration_section: $ => seq(
      $._CONFIGURATION,
      $._SECTION,
      '.',
      repeat($._configuration_paragraph)
    ),

    _configuration_paragraph: $ => choice(
      $.source_computer_paragraph,
      $.object_computer_paragraph,
      $.special_names_paragraph,
      $.repository_paragraph,
    ),

    source_computer_paragraph: $ => seq(
      $._SOURCE_COMPUTER,
      '.',
      optional($._source_computer_entry),
    ),

    _source_computer_entry: $ => choice(
      seq($.WORD, '.'),
      seq($.WORD, $.with_debugging_mode, '.'),
      seq($.with_debugging_mode, '.')
    ),

    with_debugging_mode: $ => seq(
      optional($._WITH),
      $._DEBUGGING,
      $._MODE
    ),

    object_computer_paragraph: $ => seq(
      $._OBJECT_COMPUTER,
      '.',
      optional($._object_computer_entry)
    ),

    _object_computer_entry: $ => choice(
      seq($.WORD, '.'),
      seq($.WORD, repeat1($.object_clause), '.'),
      seq(repeat1($.object_clause), '.')
    ),

    object_clause: $ => choice(
      $.object_computer_memory,
      $.object_computer_sequence,
      $.object_computer_segment
    ),

    object_computer_memory: $ => seq(
      $._MEMORY,
      $._SIZE,
      optional($._IS),
      $.integer,
      choice(
        $._CHARACTERS,
        $._WORDS
      )
    ),

    object_computer_sequence: $ => seq(
      optional($._PROGRAM),
      $._coll_sequence,
      optional($._IS),
      $.qualified_word
    ),

    _coll_sequence: $ => seq(
      optional($._COLLATING),
      $._SEQUENCE
    ),

    object_computer_segment: $ => seq(
      $._SEGMENT_LIMIT,
      optional($._IS),
      $.integer
    ),

    special_names_paragraph: $ => seq(
      $._SPECIAL_NAMES,
      '.',
      repeat($.special_name),
      optional('.')
    ),

    special_name: $ => choice(
      $.mnemonic_name_clause,
      $.alphabet_name_clause,
      $.symbolic_characters_clause,
      $.locale_clause,
      $.class_name_clause,
      $.currency_sign_clause,
      $.decimal_point_clause,
      $.cursor_clause,
      $.crt_status_clause,
      $.screen_control,
      $.event_status,
    ),

    mnemonic_name_clause: $ => /todo_mnemonic_name/,
    alphabet_name_clause: $ => /todo_alphabet_name/,
    symbolic_characters_clause: $ => /todo_symbolic_character_name/,
    locale_clause: $ => /todo_locale_name/,
    class_name_clause: $ => /todo_class_name/,
    currency_sign_clause: $ => /todo_currency_sign_name/,
    decimal_point_clause: $ => /todo_decimal_point_name/,
    cursor_clause: $ => /todo_cursor_name/,
    crt_status_clause: $ => /todo_crt_status_name/,
    screen_control: $ => /todo_screen_control_name/,
    event_status: $ => /todo_event_status_name/,

    repository_paragraph: $ => seq(
      $._REPOSITORY,
      '.',
      optional($._repository)
    ),

    _repository: $ => seq(
      repeat1($.repository_name),
      '.'
    ),

    repository_name: $ => seq(
      $._FUNCTION,
      choice(
        repeat1($.LITERAL),
        $.ALL
      ),
      $._INTRINSIC
    ),

    input_output_section: $ => choice(
      seq(
        $._INPUT_OUTPUT, $._SECTION, '.',
        $._file_control_paragraph,
        $._i_o_control_paragraph
      ),
      seq(
        $._FILE_CONTROL, '.',
        repeat($.file_control_entry)
      ),
      seq(
        $._I_O_CONTROL, '.',
        optional($.i_o_control)
      ),
    ),

    _file_control_paragraph: $ => seq(
      $._FILE_CONTROL, '.',
      repeat($.file_control_entry)
    ),

    file_control_entry: $ => seq(
      $.SELECT,
      optional($.OPTIONAL),
      $.WORD,
      repeat($._select_clause),
    ),

    _i_o_control_paragraph: $ => seq(
      $._I_O_CONTROL, '.', optional($.i_o_control),
    ),

    i_o_control: $ => choice(
      seq(repeat1($.i_o_control_clause), optional('.')),
      seq(repeat1($.apply_clause), optional('.')),
    ),

    i_o_control_clause: $ => choice(
      $.same_clause,
      $.multiple_file_tape_clause
    ),

    same_clause: $ => /todo_same_clause/,
    multiple_file_tape_clause: $ => /todo_multiple_file_tape_clause/,

    apply_clause: $ => /todo_apply_clause/,

    _select_clause: $ => choice(
      $.assign_clause,
      $.access_mode_clause,
      $.alternative_record_key,
      $.collating_sequence_clause,
      $.file_status_clause,
      $.lock_mode_clause,
      $.organization_clause,
      $.padding_character_clause,
      $.record_delimiter_clause,
      $.record_key_clause,
      $.relative_key_clause,
      $.reserve_clause,
      $.sharing_clause,
      $.error,
      $.nominal_key_clause,
    ),

    assign_clause: $ => seq(
      $._ASSIGN,
      optional($._TO),
      optional($._ext_clause),
      choice(
        $.DISK,
        $.PRINTER,
        seq(optional($._device), $.assignment_name),
      )
    ),

    _ext_clause: $ => choice(
      $.EXTERNAL,
      $.DYNAMIC
    ),

    _device: $ => choice(
      $.DISK,
      $.PRINTER,
    ),

    assignment_name: $ => choice(
      $._literal,
      $.DISPLAY,
      seq(
        optional($._literal), repeat1($.qualified_word)
      )
    ),

    access_mode_clause: $ => seq(
      $._ACCESS,
      optional($._MODE),
      optional($._IS),
      choice(
        $.SEQUENTIAL,
        $.DYNAMIC,
        $.RANDOM
      )
    ),

    alternative_record_key: $ => seq(
      $._ALTERNATE,
      $._RECORD,
      optional($._KEY),
      optional($._IS),
      field('reference', $.qualified_word),
      field('with_dups', optional($._with_dups)),
    ),

    _with_dups: $ => seq(
      optional($._WITH),
      $._DUPLICATES
    ),

    collating_sequence_clause: $ => seq(
      $._coll_sequence,
      optional($._IS),
      $.WORD
    ),

    _coll_sequence: $ => seq(
      optional($._COLLATING),
      $._SEQUENCE
    ),

    file_status_clause: $ => seq(
      field('file_or_sort', optional($._file_or_sort)),
      $._STATUS,
      optional($._IS),
      field('reference', $.qualified_word),
      field('reference2', optional($.qualified_word)),
    ),

    _file_or_sort: $ => choice(
      $.FILE,
      $.SORT
    ),

    lock_mode_clause: $ => seq(
      $._LOCK,
      optional($._MODE),
      optional($._IS),
      $.lock_mode
    ),

    lock_mode: $ => choice(
      seq(
        choice($.MANUAL, $.AUTOMATIC),
        field('lock_with', optional($._lock_with))
      ),
      $.EXCLUSIVE
    ),

    _lock_with: $ => (
      seq(
        $._WITH, $._LOCK, $._ON,
        optional($.MULTIPLE),
        choice($._RECORD, $._RECORDS)
      ),
      seq($._WITH, $.RECORD)
    ),

    organization_clause: $ => seq(
      optional(seq($._ORGANIZATION, optional($._IS))),
      choice(
        $.INDEXED,
        seq($.RECORD, optional($._BINARY), $.SEQUENTIAL),
        $.SEQUENTIAL,
        $.RELATIVE,
      )
    ),

    padding_character_clause: $ => seq(
      $._PADDING,
      optional($._CHARACTER),
      optional($._IS),
      choice($.qualified_word, $._LITERAL)
    ),

    record_delimiter_clause: $ => /todo_record_delimiter_clause/,
    record_key_clause: $ => /todo_record_key_clause/,
    relative_key_clause: $ => /todo_relative_key_clause/,
    reserve_clause: $ => /todo_reserve_clause/,
    sharing_clause: $ => /todo_sharing_clause/,
    error: $ => /todo_error/,
    nominal_key_clause: $ => /todo_nominal_key_clause/,

    data_division: $ => seq(
      $._DATA, $._DIVISION, '.',
      optional($.file_section),
      optional($.working_storage_section),
      optional($.local_storage_section),
      optional($.linkage_section),
      optional($.report_section),
      optional($.screen_section),
    ),

    file_section: $ => /todo_file_section/,
    working_storage_section: $ => seq(
      $._WORKING_STORAGE, $._SECTION, '.',
      repeat(seq($.data_description, '.'))
    ),

    data_description: $ => choice(
      $.constant_entry,
      seq(
        $.level_number, $.entry_name,
        repeat($._data_description_clause), optional($._LITERAL)
      ),
      seq(
        $.level_number_88, $.entry_name
      ),
    ),

    level_number: $ => /[0-9][0-9]/,
    level_number_88: $ => /88/,

    entry_name: $ => choice(
      $._FILLER,
      $._WORD
    ),

    constant_entry: $ => /todo_constant_entry/,

    _data_description_clause: $ => choice(
      $.redefines_clause,
      $.external_clause,
      $.global_clause,
      $.picture_clause,
      $.usage_clause,
      $.sign_clause,
      $.occurs_clause,
      $.justified_clause,
      $.synchronized_clause,
      $.blank_clause,
      $.based_clause,
      $.value_clause,
      $.renames_clause,
      $.any_length_clause,
      $.error
    ),

    redefines_clause: $ => seq(
      $._REDEFINES, $._identifier
    ),

    _identifier: $ => choice(
      $.qualified_word,
      seq($.qualified_word, $.subref),
      seq($.qualified_word, $.refmod),
      seq($.qualified_word, $.subref, $.refmod),
    ),

    qualified_word: $ => sepBy(
      $.WORD, $._in_of
    ),

    _in_of: $ => choice(
      $._IN,
      $._OF
    ),

    subref: $ => seq(
      '(',
      $._exp_list,
      ')'
    ),

    refmod: $ => seq(
      '(',
      $._exp,
      ':',
      ')'
    ),

    _exp_list: $ => sepBy(
      $._exp, $._e_sep
    ),

    _exp: $ => choice(
      $._arith_x,
      $._binary_exp,
      $._unary_exp,
      seq('(', $._exp, ')')
    ),

    _binary_exp: $ => choice(
      $.pow_exp,
      $.mul_exp,
      $.div_exp,
      $.add_exp,
      $.sub_exp,
    ),

    _unary_exp: $ => prec(4, choice(
      $.positive_exp,
      $.negative_exp
    )),

    positive_exp: $ => seq(
      '+',
      field('value', $._exp)
    ),

    negative_exp: $ => seq(
      '-',
      field('value', $._exp)
    ),

    add_exp: $ => prec.left(1, seq(
      field('left', $._exp),
      '+',
      field('right', $._exp)
    )),

    sub_exp: $ => prec.left(1, seq(
      field('left', $._exp),
      '-',
      field('right', $._exp)
    )),

    mul_exp: $ => prec.left(2, seq(
      field('left', $._exp),
      '*',
      field('right', $._exp)
    )),

    div_exp: $ => prec.left(2, seq(
      field('left', $._exp),
      '/',
      field('right', $._exp)
    )),

    pow_exp: $ => prec.left(3, seq(
      field('left', $._exp),
      '^',
      field('right', $._exp)
    )),

    //todo
    _arith_x: $ => choice(
      $._identifier,
      seq($.LENGTH, optional($._OF), $._identifier),
      seq($.LENGTH, optional($._OF), $._basic_literal),
      seq($.LENGTH, optional($._OF), $.function_),
      $._basic_literal,
      $.function_,
      $.linage_counter,
    ),

    external_clause: $ => /todo_external_clause/,
    global_clause: $ => /todo_global_clause/,
    picture_clause: $ => seq(
      choice($._PICTURE, $._PIC),
      optional($._IS),
      $._picture_string
    ),

    //todo
    _picture_string: $ => choice(
      $.picture_x,
      $.picture_9,
    ),

    picture_x: $ => /([xX](\([0-9]+\))?)+/,

    picture_9: $ => choice(
      $._picture_9_z,
      $._picture_9_v,
    ),
    _picture_9_z: $ => /(9(\([0-9]+\))?)+([zZ](\([0-9]+\))?)+/,
    _picture_9_v: $ => /(9(\([0-9]+\))?)+([vV](9(\([0-9]+\))?)+)?/,

    usage_clause: $ => /todo_usage_clause/,
    sign_clause: $ => /todo_sign_clause/,
    occurs_clause: $ => /todo_occurs_clause/,
    justified_clause: $ => /todo_justified_clause/,
    synchronized_clause: $ => /todo_synchronized_clause/,
    blank_clause: $ => /todo_blank_clause/,
    based_clause: $ => /todo_based_clause/,
    value_clause: $ => /todo_value_clause/,
    renames_clause: $ => /todo_renames_clause/,
    any_length_clause: $ => /todo_any_length/,
    error: $ => /todo_error/,

    local_storage_section: $ => /local_storage_section/,
    linkage_section: $ => /linkage_section/,
    report_section: $ => /report_section/,
    screen_section: $ => /screen_section/,

    //todo
    procedure_division: $ => seq(
      $._PROCEDURE, $._DIVISION,
      optional($.procedure_using_chaining),
      optional($.procedure_returning),
      '.',
      optional($.procedure_declaratives),
      repeat($._procedure),
    ),

    procedure_using_chaining: $ => seq(
      choice($.USING, $.CHAINING),
      repeat($.procedure_param),
    ),

    procedure_param: $ => seq(
      optional($.procedure_type),
      optional($.size),
      optional($.OPTIONAL),
      $._WORD
    ),

    procedure_type: $ => seq(
      optional($._BY),
      choice($.VALUE, $.REFERENCE)
    ),

    size: $ => choice(
      seq($.SIZE, optional($._IS), $.AUTO),
      seq($.SIZE, optional($._IS), $.DEFAULT),
      seq($.UNSIGNED, $.SIZE, optional($._IS), $.integer),
      seq($.SIZE, optional($._IS), $.integer),
    ),

    procedure_type: $ => seq(
      optional($._BY),
      choice($.REFERENCE, $.VALUE)
    ),

    procedure_returning: $ => seq(
      $._RETURNING,
      $._WORD
    ),

    procedure_declaratives: $ => seq(
      $._DECLARATIVES, '.',
      repeat($._procedure),
      $._END, $._DECLARATIVES, '.'
    ),

    _procedure: $ => choice(
      $.section_header,
      $.paragraph_header,
      $.invalid_statement,
      seq($._statement, '.')
    ),

    section_header: $ => seq(
      field('name', $._WORD),
      $._SECTION,
      optional($._LITERAL),
      '.'
    ),

    paragraph_header: $ => seq(
      field('name', $._WORD),
      '.'
    ),

    invalid_statement: $ => seq(
      field('name', $._WORD)
    ),

    nested_prog: $ => /todo_nested_prog/,
    end_program: $ => /todo_end_program/,

    //todo
    _statement: $ => choice(
      //$.accept_statement,
      //$.add_statement,
      //$.allocate_statement,
      //$.alter_statement,
      //$.call_statement,
      //$.cancel_statement,
      //$.close_statement,
      //$.commit_statement,
      //$.compute_statement,
      //$.continue_statement,
      //$.delete_statement,
      //$.delete_file_statement,
      $.display_statement,
      //$.divide_statement,
      //$.entry_statement,
      //$.evaluate_statement,
      //$.exit_statement,
      //$.free_statement,
      //$.generate_statement,
      //$.goto_statement,
      //$.goback_statement,
      $.if_statement,
      //$.initialize_statement,
      //$.initiate_statement,
      //$.inspect_statement,
      //$.merge_statement,
      $.move_statement,
      //$.multiply_statement,
      //$.open_statement,
      //$.perform_statement,
      //$.read_statement,
      //$.release_statement,
      //$.return_statement,
      //$.rewrite_statement,
      //$.rollback_statement,
      //$.search_statement,
      //$.set_statement,
      //$.sort_statement,
      //$.start_statement,
      $.stop_statement,
      //$.string_statement,
      //$.subtract_statement,
      //$.suppress_statement,
      //$.terminate_statement,
      //$.transform_statement,
      //$.unlock_statement,
      //$.unstring_statement,
      //$.use_statement,
      //$.write_statement,
      //$.NEXT_SENTENCE,
    ),

    //todo
    stop_statement: $ => seq(
      $._STOP, $._RUN
    ),

    display_statement: $ => prec.right(0, seq(
      $._DISPLAY,
      $._display_body,
      optional($._END_DISPLAY)
    )),

    _display_body: $ => choice(
      seq($._id_or_lit, $._UPON_ENVIRONMENT_NAME, optional($.on_disp_exception)),
      seq($._id_or_lit, $._UPON_ENVIRONMENT_VALUE, optional($.on_disp_exception)),
      seq($._id_or_lit, $._UPON_ARGUMENT_NUMBER, optional($.on_disp_exception)),
      seq($._id_or_lit, $._UPON_COMMAND_LINE, optional($.on_disp_exception)),
      seq(repeat1($._x), optional($.at_line_column), optional($.with_clause), optional($.on_disp_exception)),
      seq(repeat1($._x), optional($.at_line_column), $.UPON, $.MNEMONIC_NAME, optional($.with_clause), optional($.on_disp_exception)),
      seq(repeat1($._x), optional($.at_line_column), $.UPON, $._WORD, optional($.with_clause), optional($.on_disp_exception)),
      seq(repeat1($._x), optional($.at_line_column), $.UPON, $.PRINTER, optional($.with_clause), optional($.on_disp_exception)),
      seq(repeat1($._x), optional($.at_line_column), $.UPON, $.CRT, optional($.with_clause), optional($.on_disp_exception)),
    ),

    at_line_column: $ => /todo_at_line_column/,

    _id_or_lit: $ => choice(
      $._identifier,
      $._literal
    ),

    on_disp_exception: $ => prec.right(0, seq(
      choice($.EXCEPTION, $.NOT_EXCEPTION),
      repeat($._statement)
    )),

    with_clause: $ => choice(
      seq(optional($.WITH), $.NO_ADVANCING),
      seq($.WITH, repeat1($.disp_attr))
    ),

    disp_attr: $ => choice(
      $.BELL,
      $.BLINK,
      seq($.ERASE, $.EOL),
      seq($.ERASE, $.EOS),
      $.HIGHLIGHT,
      $.LOWLIGHT,
      $.REVERSE_VIDEO,
      $.UNDERLINE,
      $.OVERLINE,
      seq(
        choice($.FOREGROUND_COLOR, $.BACKGROUND_COLOR),
        optional($._IS),
        $._num_or_id_or_lit),
      seq(
        $.SCROLL,
        choice($.UP, $.DOWN),
        optional($._IS), optional($.scroll_lines)),
      $.BLANK_LINE,
      $.BLANK_SCREEN,
    ),

    _num_or_id_or_lit: $ => choice(
      $._identifier,
      $.number,//todo convert this to integer
      $.ZERO
    ),

    scroll_lines: $ => seq(
      optional($._BY),
      $._num_or_id_or_lit,
      optional($.line_or_lines),
    ),

    line_or_lines: $ => choice($.LINE, $.LINES),

    //todo add error if statement (see cobc/parser.y)
    if_statement: $ => prec.left(seq(
      $._IF,
      field('condition', $.expr),
      optional($._THEN),
      field('statements', repeat($._statement)),
      field('else_statements', optional($._if_else_sentense)),
      optional($._END_IF)
    )),

    _if_else_sentense: $ => prec.left(seq(
      $._ELSE,
      repeat($._statement)
    )),

    expr: $ => $._expr_logic,

    _expr_data: $ => $._x,

    _expr_calc: $ => choice(
      $._expr_calc_binary,
      $._expr_calc_unary,
      $._expr_data
    ),

    _expr_calc_binary: $ => choice(
      prec.left(1, seq($._expr_calc, '+', $._expr_calc)),
      prec.left(1, seq($._expr_calc, '-', $._expr_calc)),
      prec.left(2, seq($._expr_calc, '*', $._expr_calc)),
      prec.left(2, seq($._expr_calc, '/', $._expr_calc)),
      prec.left(3, seq($._expr_calc, '^', $._expr_calc)),
    ),

    _expr_calc_unary: $ => prec(4, choice(
      seq('+', $._expr_calc),
      seq('-', $._expr_calc),
      seq('^', $._expr_calc),
    )),

    _expr_compare: $ => choice(
      prec.left(-1, seq($._expr_calc, $.eq, $._expr_calc)),
      prec.left(-1, seq($._expr_calc, $.gt, $._expr_calc)),
      prec.left(-1, seq($._expr_calc, $.lt, $._expr_calc)),
      prec.left(-1, seq($._expr_calc, $.ge, $._expr_calc)),
      prec.left(-1, seq($._expr_calc, $.lt, $._expr_calc)),
      prec.left(-1, seq($._expr_calc, $.NE, $._expr_calc)),
    ),

    _expr_is: $ => choice(
      seq($._expr_calc, optional($._IS), choice(
        $.OMITTED,
        $.NUMERIC,
        $.ALPHABETIC,
        $.ALPHABETIC_LOWER,
        $.ALPHABETIC_UPPER,
        $.CLASS_NAME,
        $.POSITIVE,
        $.NEGATIVE,
        $.ZERO
      ))
    ),

    _expr_bool: $ => choice(
      $._expr_is,
      $._expr_compare,
    ),

    _expr_logic: $ => prec.left(choice(
      seq($.NOT, $._expr_logic),
      seq($._expr_logic, choice($.AND, $.OR), $._expr_logic),
      $._expr_bool
    )),

    eq: $ => choice(
      '=',
      seq($._EQUAL, optional($._TO)),
      $._EQUALS
    ),

    gt: $ => choice(
      '>',
      seq($.GREATER, optional($._THAN))
    ),

    lt: $ => choice(
      '<',
      seq($.LESS, optional($._THAN))
    ),

    ge: $ => choice(
      '>=',
      seq($.GREATER, optional($._THAN), optional($._OR), $._EQUAL, optional($._TO)),
    ),

    le: $ => choice(
      '<=',
      seq($.LESS, optional($._THAN), optional($._OR), $._EQUAL, optional($._TO)),
    ),

    move_statement: $ => seq(
      $._MOVE,
      $._move_body
    ),

    _move_body: $ => seq(
      optional($._CORRESPONDING),
      field('src', $._x),
      $._TO,
      field('dst', $._target_x_list)
    ),

    _x: $ => choice(
      seq($._LENGTH, optional($._OF), choice(
        $._identifier,
        $._basic_literal,
        $.function_)
      ),
      seq($._ADDRESS, optional($._OF), choice(
        seq(
          choice($._PROGRAM, $._ENTRY),
          choice($._identifier, $._LITERAL)),
        $._identifier,
      )),
      $._literal,
      $.function_,
      $.linage_counter,
      $._identifier,
    ),

    _target_x_list: $ => repeat1($._target_x),
    _target_x: $ => choice(
      $._identifier,
      seq($._ADDRESS, optional($._OF), $._identifier)
    ),

    _basic_literal: $ => sepBy(
      $._basic_value,
      '&'
    ),

    _basic_value: $ => choice(
      $._LITERAL,
      $.SPACE,
      $.ZERO,
      $.QUOTE,
      $.HIGH_VALUE,
      $.LOW_VALUE,
      $.TOK_NULL
    ),

    _literal: $ => choice(
      $._basic_literal,
      seq($.ALL, $._basic_value)
    ),

    function_: $ => choice(
      seq($.CURRENT_DATE_FUNC, optional($.func_refmod)),
      seq($.WHEN_COMPILED_FUNC, optional($.func_refmod)),
      seq($.UPPER_CASE_FUNC, '(', $._exp, ')', optional($.func_refmod)),
      seq($.LOWER_CASE_FUNC, '(', $._exp, ')', optional($.func_refmod)),
      seq($.REVERSE_FUNC, '(', $._exp, ')', optional($.func_refmod)),
      seq($.CONCATENATE_FUNC, '(', $._exp_list, ')', optional($.func_refmod)),
      seq($.SUBSTITUTE_FUNC, '(', $._exp_list, ')', optional($.func_refmod)),
      seq($.SUBSTITUTE_CASE_FUNC, '(', $._exp_list, ')', optional($.func_refmod)),
      seq($.TRIM_FUNCTION, '(', $._trim_args, ')', optional($.func_refmod)),
      seq($.NUMVALC_FUNC, '(', $._numvalc_args, ')'),
      seq($.LOCALE_DT_FUNC, '(', $._locale_dt_args, ')', optional($.func_refmod)),
      seq($.FUNCTION_NAME, optional($._func_args)),
    ),

    func_refmod: $ => choice(
      seq('(', $._exp, ':', ')'),
      seq('(', $._exp, ':', $._exp, ')'),
    ),

    _trim_args: $ => seq(
      $._exp,
      optional(
        seq(
          $._e_sep,
          choice($._LEADING, $._TRAILING)
        )
      )
    ),

    _e_sep: $ => choice(
      $._COMMA_DELIM,
      $._SEMI_COLON
    ),

    _numvalc_args: $ => sepBy(
      $._exp, $._e_sep
    ),

    _locale_dt_args: $ => seq(
      $._exp,
      optional(
        seq($._e_sep, $.qualified_word)
      )
    ),

    linage_counter: $ => seq(
      $._LINAGE_COUNTER,
      optional(seq($._in_of, $._WORD))
    ),

    _func_args: $ => seq(
      '(', optional($._exp_list), ')'
    ),

    _LITERAL: $ => choice(
      $.number,
      $._string,
    ),

    //todo
    number: $ => choice($.integer, $.decimal),
    integer: $ => /[+-]?[0-9]+/,
    decimal: $ => /[+-]?[0-9]+\.[0-9]+/,
    _string: $ => choice(
      $.x_string,
      $.n_string,
      $.h_string
    ),

    x_string: $ => choice(
      /'[^'\n]*'/,
      /"[^"\n]*"/,
    ),

    h_string: $ => choice(
      /H'[^'\n]*'/,
      /H"[^"\n]*"/,
    ),

    n_string: $ => choice(
      /N'[^'\n]*'/,
      /N"[^"\n]*"/,
      /NC'[^'\n]*'/,
      /NC"[^"\n]*"/,
      /ND'[^'\n]*'/,
      /ND"[^"\n]*"/,
      /NX'[^'\n]*'/,
      /NX"[^"\n]*"/,
    ),

    _ACCEPT: $ => /[aA][cC][cC][eE][pP][tT]/,
    _ACCESS: $ => /[aA][cC][cC][eE][sS][sS]/,
    _ADD: $ => /[aA][dD][dD]/,
    _ADDRESS: $ => /[aA][dD][dD][rR][eE][sS][sS]/,
    _ADVANCING: $ => /[aA][dD][vV][aA][nN][cC][iI][nN][gG]/,
    _AFTER: $ => /[aA][fF][tT][eE][rR]/,
    _ALL: $ => /[aA][lL][lL]/,
    _ALLOCATE: $ => /[aA][lL][lL][oO][cC][aA][tT][eE]/,
    _ALPHABET: $ => /[aA][lL][pP][hH][aA][bB][eE][tT]/,
    _ALPHABETIC: $ => /[aA][lL][pP][hH][aA][bB][eE][tT][iI][cC]/,
    _ALPHABETIC_LOWER: $ => /[aA][lL][pP][hH][aA][bB][eE][tT][iI][cC]-[lL][oO][wW][eE][rR]/,
    _ALPHABETIC_UPPER: $ => /[aA][lL][pP][hH][aA][bB][eE][tT][iI][cC]-[uU][pP][pP][eE][rR]/,
    _ALPHANUMERIC: $ => /[aA][lL][pP][hH][aA][nN][uU][mM][eE][rR][iI][cC]/,
    _ALPHANUMERIC_EDITED: $ => /[aA][lL][pP][hH][aA][nN][uU][mM][eE][rR][iI][cC]-[eE][dD][iI][tT][eE][dD]/,
    _ALSO: $ => /[aA][lL][sS][oO]/,
    _ALTER: $ => /[aA][lL][tT][eE][rR]/,
    _ALTERNATE: $ => /[aA][lL][tT][eE][rR][nN][aA][tT][eE]/,
    _AND: $ => /[aA][nN][dD]/,
    _ANY: $ => /[aA][nN][yY]/,
    _APPLY: $ => /[aA][pP][pP][lL][yY]/,
    _ARE: $ => /[aA][rR][eE]/,
    _AREA: $ => /[aA][rR][eE][aA]/,
    _ARGUMENT_NUMBER: $ => /[aA][rR][gG][uU][mM][eE][nN][tT]-[nN][uU][mM][bB][eE][rR]/,
    _ARGUMENT_VALUE: $ => /[aA][rR][gG][uU][mM][eE][nN][tT]-[vV][aA][lL][uU][eE]/,
    _AS: $ => /[aA][sS]/,
    _ASCENDING: $ => /[aA][sS][cC][eE][nN][dD][iI][nN][gG]/,
    _ASSIGN: $ => /[aA][sS][sS][iI][gG][nN]/,
    _AT: $ => /[aA][tT]/,
    _AUTO: $ => /[aA][uU][tT][oO]/,
    _AUTOMATIC: $ => /[aA][uU][tT][oO][mM][aA][tT][iI][cC]/,
    _BACKGROUND_COLOR: $ => /[bB][aA][cC][kK][gG][rR][oO][uU][nN][dD]-[cC][oO][lL][oO][rR]/,
    _BASED: $ => /[bB][aA][sS][eE][dD]/,
    _BEFORE: $ => /[bB][eE][fF][oO][rR][eE]/,
    _BELL: $ => /[bB][eE][lL][lL]/,
    _BINARY: $ => /[bB][iI][nN][aA][rR][yY]/,
    _BINARY_C_LONG: $ => /[bB][iI][nN][aA][rR][yY]-[cC]-[lL][oO][nN][gG]/,
    _BINARY_CHAR: $ => /[bB][iI][nN][aA][rR][yY]-[cC][hH][aA][rR]/,
    _BINARY_DOUBLE: $ => /[bB][iI][nN][aA][rR][yY]-[dD][oO][uU][bB][lL][eE]/,
    _BINARY_LONG: $ => /[bB][iI][nN][aA][rR][yY]-[lL][oO][nN][gG]/,
    _BINARY_SHORT: $ => /[bB][iI][nN][aA][rR][yY]-[sS][hH][oO][rR][tT]/,
    _BLANK: $ => /[bB][lL][aA][nN][kK]/,
    _BLANK_LINE: $ => /[bB][lL][aA][nN][kK]-[lL][iI][nN][eE]/,
    _BLANK_SCREEN: $ => /[bB][lL][aA][nN][kK]-[sS][cC][rR][eE][eE][nN]/,
    _BLINK: $ => /[bB][lL][iI][nN][kK]/,
    _BLOCK: $ => /[bB][lL][oO][cC][kK]/,
    _BOTTOM: $ => /[bB][oO][tT][tT][oO][mM]/,
    _BY: $ => /[bB][yY]/,
    _BYTE_LENGTH: $ => /[bB][yY][tT][eE]-[lL][eE][nN][gG][tT][hH]/,
    _CALL: $ => /[cC][aA][lL][lL]/,
    _CANCEL: $ => /[cC][aA][nN][cC][eE][lL]/,
    _CH: $ => /[cC][hH]/,
    _CHAINING: $ => /[cC][hH][aA][iI][nN][iI][nN][gG]/,
    _CHARACTER: $ => /[cC][hH][aA][rR][aA][cC][tT][eE][rR]/,
    _CHARACTERS: $ => /[cC][hH][aA][rR][aA][cC][tT][eE][rR][sS]/,
    _CLASS: $ => /[cC][lL][aA][sS][sS]/,
    _CLASS_NAME: $ => /[cC][lL][aA][sS][sS]-[nN][aA][mM][eE]/,
    _CLOSE: $ => /[cC][lL][oO][sS][eE]/,
    _CLOSE_NOFEED: $ => /[cC][lL][oO][sS][eE]-[nN][oO][fF][eE][eE][dD]/,
    _CODE: $ => /[cC][oO][dD][eE]/,
    _CODE_SET: $ => /[cC][oO][dD][eE]-[sS][eE][tT]/,
    _COLLATING: $ => /[cC][oO][lL][lL][aA][tT][iI][nN][gG]/,
    _COL: $ => /[cC][oO][lL]/,
    _COLS: $ => /[cC][oO][lL][sS]/,
    _COLUMN: $ => /[cC][oO][lL][uU][mM][nN]/,
    _COLUMNS: $ => /[cC][oO][lL][uU][mM][nN][sS]/,
    _COMMA: $ => /[cC][oO][mM][mM][aA]/,
    _COMMAND_LINE: $ => /[cC][oO][mM][mM][aA][nN][dD]-[lL][iI][nN][eE]/,
    _COMMA_DELIM: $ => /[cC][oO][mM][mM][aA]-[dD][eE][lL][iI][mM]/,
    _COMMIT: $ => /[cC][oO][mM][mM][iI][tT]/,
    _COMMITMENT_CONTROL: $ => /[cC][oO][mM][mM][iI][tT][mM][eE][nN][tT]-[cC][oO][nN][tT][rR][oO][lL]/,
    _COMMON: $ => /[cC][oO][mM][mM][oO][nN]/,
    _COMP: $ => /[cC][oO][mM][pP]/,
    _COMPUTE: $ => /[cC][oO][mM][pP][uU][tT][eE]/,
    _COMP_1: $ => /[cC][oO][mM][pP]-1/,
    _COMP_2: $ => /[cC][oO][mM][pP]-2/,
    _COMP_3: $ => /[cC][oO][mM][pP]-3/,
    _COMP_4: $ => /[cC][oO][mM][pP]-4/,
    _COMP_5: $ => /[cC][oO][mM][pP]-5/,
    _COMP_X: $ => /[cC][oO][mM][pP]-[xX]/,
    _CONCATENATE_FUNC: $ => /[cC][oO][nN][cC][aA][tT][eE][nN][aA][tT][eE]-[fF][uU][nN][cC]/,
    _CONFIGURATION: $ => /[cC][oO][nN][fF][iI][gG][uU][rR][aA][tT][iI][oO][nN]/,
    _CONSTANT: $ => /[cC][oO][nN][sS][tT][aA][nN][tT]/,
    _CONTAINS: $ => /[cC][oO][nN][tT][aA][iI][nN][sS]/,
    _CONTENT: $ => /[cC][oO][nN][tT][eE][nN][tT]/,
    _CONTINUE: $ => /[cC][oO][nN][tT][iI][nN][uU][eE]/,
    _CONTROL: $ => /[cC][oO][nN][tT][rR][oO][lL]/,
    _CONTROLS: $ => /[cC][oO][nN][tT][rR][oO][lL][sS]/,
    _CONTROL_FOOTING: $ => /[cC][oO][nN][tT][rR][oO][lL]-[fF][oO][oO][tT][iI][nN][gG]/,
    _CONTROL_HEADING: $ => /[cC][oO][nN][tT][rR][oO][lL]-[hH][eE][aA][dD][iI][nN][gG]/,
    _CONVERTING: $ => /[cC][oO][nN][vV][eE][rR][tT][iI][nN][gG]/,
    _CORE_INDEX: $ => /[cC][oO][rR][eE]-[iI][nN][dD][eE][xX]/,
    _CORRESPONDING: $ => /[cC][oO][rR][rR][eE][sS][pP][oO][nN][dD][iI][nN][gG]/,
    _COUNT: $ => /[cC][oO][uU][nN][tT]/,
    _CRT: $ => /[cC][rR][tT]/,
    _CURRENCY: $ => /[cC][uU][rR][rR][eE][nN][cC][yY]/,
    _CURRENT_DATE_FUNC: $ => /[cC][uU][rR][rR][eE][nN][tT]-[dD][aA][tT][eE]-[fF][uU][nN][cC]/,
    _CURSOR: $ => /[cC][uU][rR][sS][oO][rR]/,
    _CYCLE: $ => /[cC][yY][cC][lL][eE]/,
    _CYL_OVERFLOW: $ => /[cC][yY][lL]-[oO][vV][eE][rR][fF][lL][oO][wW]/,
    _DATA: $ => /[dD][aA][tT][aA]/,
    _DATE: $ => /[dD][aA][tT][eE]/,
    _DAY: $ => /[dD][aA][yY]/,
    _DAY_OF_WEEK: $ => /[dD][aA][yY]-[oO][fF]-[wW][eE][eE][kK]/,
    _DE: $ => /[dD][eE]/,
    _DEBUGGING: $ => /[dD][eE][bB][uU][gG][gG][iI][nN][gG]/,
    _DECIMAL_POINT: $ => /[dD][eE][cC][iI][mM][aA][lL]-[pP][oO][iI][nN][tT]/,
    _DECLARATIVES: $ => /[dD][eE][cC][lL][aA][rR][aA][tT][iI][vV][eE][sS]/,
    _DEFAULT: $ => /[dD][eE][fF][aA][uU][lL][tT]/,
    _DELETE: $ => /[dD][eE][lL][eE][tT][eE]/,
    _DELIMITED: $ => /[dD][eE][lL][iI][mM][iI][tT][eE][dD]/,
    _DELIMITER: $ => /[dD][eE][lL][iI][mM][iI][tT][eE][rR]/,
    _DEPENDING: $ => /[dD][eE][pP][eE][nN][dD][iI][nN][gG]/,
    _DESCENDING: $ => /[dD][eE][sS][cC][eE][nN][dD][iI][nN][gG]/,
    _DETAIL: $ => /[dD][eE][tT][aA][iI][lL]/,
    _DISK: $ => /[dD][iI][sS][kK]/,
    _DISPLAY: $ => /[dD][iI][sS][pP][lL][aA][yY]/,
    _DIVIDE: $ => /[dD][iI][vV][iI][dD][eE]/,
    _DIVISION: $ => /[dD][iI][vV][iI][sS][iI][oO][nN]/,
    _DOWN: $ => /[dD][oO][wW][nN]/,
    _DUPLICATES: $ => /[dD][uU][pP][lL][iI][cC][aA][tT][eE][sS]/,
    _DYNAMIC: $ => /[dD][yY][nN][aA][mM][iI][cC]/,
    _EBCDIC: $ => /[eE][bB][cC][dD][iI][cC]/,
    _ELSE: $ => /[eE][lL][sS][eE]/,
    _END: $ => /[eE][nN][dD]/,
    _END_ACCEPT: $ => /[eE][nN][dD]-[aA][cC][cC][eE][pP][tT]/,
    _END_ADD: $ => /[eE][nN][dD]-[aA][dD][dD]/,
    _END_CALL: $ => /[eE][nN][dD]-[cC][aA][lL][lL]/,
    _END_COMPUTE: $ => /[eE][nN][dD]-[cC][oO][mM][pP][uU][tT][eE]/,
    _END_DELETE: $ => /[eE][nN][dD]-[dD][eE][lL][eE][tT][eE]/,
    _END_DISPLAY: $ => /[eE][nN][dD]-[dD][iI][sS][pP][lL][aA][yY]/,
    _END_DIVIDE: $ => /[eE][nN][dD]-[dD][iI][vV][iI][dD][eE]/,
    _END_EVALUATE: $ => /[eE][nN][dD]-[eE][vV][aA][lL][uU][aA][tT][eE]/,
    _END_FUNCTION: $ => /[eE][nN][dD]-[fF][uU][nN][cC][tT][iI][oO][nN]/,
    _END_IF: $ => /[eE][nN][dD]-[iI][fF]/,
    _END_MULTIPLY: $ => /[eE][nN][dD]-[mM][uU][lL][tT][iI][pP][lL][yY]/,
    _END_PERFORM: $ => /[eE][nN][dD]-[pP][eE][rR][fF][oO][rR][mM]/,
    _END_PROGRAM: $ => /[eE][nN][dD]-[pP][rR][oO][gG][rR][aA][mM]/,
    _END_READ: $ => /[eE][nN][dD]-[rR][eE][aA][dD]/,
    _END_RETURN: $ => /[eE][nN][dD]-[rR][eE][tT][uU][rR][nN]/,
    _END_REWRITE: $ => /[eE][nN][dD]-[rR][eE][wW][rR][iI][tT][eE]/,
    _END_SEARCH: $ => /[eE][nN][dD]-[sS][eE][aA][rR][cC][hH]/,
    _END_START: $ => /[eE][nN][dD]-[sS][tT][aA][rR][tT]/,
    _END_STRING: $ => /[eE][nN][dD]-[sS][tT][rR][iI][nN][gG]/,
    _END_SUBTRACT: $ => /[eE][nN][dD]-[sS][uU][bB][tT][rR][aA][cC][tT]/,
    _END_UNSTRING: $ => /[eE][nN][dD]-[uU][nN][sS][tT][rR][iI][nN][gG]/,
    _END_WRITE: $ => /[eE][nN][dD]-[wW][rR][iI][tT][eE]/,
    _ENTRY: $ => /[eE][nN][tT][rR][yY]/,
    _ENVIRONMENT: $ => /[eE][nN][vV][iI][rR][oO][nN][mM][eE][nN][tT]/,
    _ENVIRONMENT_NAME: $ => /[eE][nN][vV][iI][rR][oO][nN][mM][eE][nN][tT]-[nN][aA][mM][eE]/,
    _ENVIRONMENT_VALUE: $ => /[eE][nN][vV][iI][rR][oO][nN][mM][eE][nN][tT]-[vV][aA][lL][uU][eE]/,
    _EOL: $ => /[eE][oO][lL]/,
    _EOP: $ => /[eE][oO][pP]/,
    _EOS: $ => /[eE][oO][sS]/,
    _EQUAL: $ => /[eE][qQ][uU][aA][lL]/,
    _EQUALS: $ => /[eE][qQ][uU][aA][lL][sS]/,
    _ERASE: $ => /[eE][rR][aA][sS][eE]/,
    _ERROR: $ => /[eE][rR][rR][oO][rR]/,
    _ESCAPE: $ => /[eE][sS][cC][aA][pP][eE]/,
    _EVALUATE: $ => /[eE][vV][aA][lL][uU][aA][tT][eE]/,
    _EVENT_STATUS: $ => /[eE][vV][eE][nN][tT]-[sS][tT][aA][tT][uU][sS]/,
    _EXCEPTION: $ => /[eE][xX][cC][eE][pP][tT][iI][oO][nN]/,
    _EXCLUSIVE: $ => /[eE][xX][cC][lL][uU][sS][iI][vV][eE]/,
    _EXIT: $ => /[eE][xX][iI][tT]/,
    _EXTEND: $ => /[eE][xX][tT][eE][nN][dD]/,
    _EXTERNAL: $ => /[eE][xX][tT][eE][rR][nN][aA][lL]/,
    _FD: $ => /[fF][dD]/,
    _FILE_CONTROL: $ => /[fF][iI][lL][eE]-[cC][oO][nN][tT][rR][oO][lL]/,
    _FILE_ID: $ => /[fF][iI][lL][eE]-[iI][dD]/,
    _FILLER: $ => /[fF][iI][lL][lL][eE][rR]/,
    _FINAL: $ => /[fF][iI][nN][aA][lL]/,
    _FIRST: $ => /[fF][iI][rR][sS][tT]/,
    _FOOTING: $ => /[fF][oO][oO][tT][iI][nN][gG]/,
    _FOR: $ => /[fF][oO][rR]/,
    _FOREGROUND_COLOR: $ => /[fF][oO][rR][eE][gG][rR][oO][uU][nN][dD]-[cC][oO][lL][oO][rR]/,
    _FOREVER: $ => /[fF][oO][rR][eE][vV][eE][rR]/,
    _FORMS_OVERLAY: $ => /[fF][oO][rR][mM][sS]-[oO][vV][eE][rR][lL][aA][yY]/,
    _FREE: $ => /[fF][rR][eE][eE]/,
    _FROM: $ => /[fF][rR][oO][mM]/,
    _FULL: $ => /[fF][uU][lL][lL]/,
    _FUNCTION: $ => /[fF][uU][nN][cC][tT][iI][oO][nN]/,
    _FUNCTION_ID: $ => /[fF][uU][nN][cC][tT][iI][oO][nN]-[iI][dD]/,
    _FUNCTION_NAME: $ => /[fF][uU][nN][cC][tT][iI][oO][nN]-[nN][aA][mM][eE]/,
    _GE: $ => /[gG][eE]/,
    _GENERATE: $ => /[gG][eE][nN][eE][rR][aA][tT][eE]/,
    _GIVING: $ => /[gG][iI][vV][iI][nN][gG]/,
    _GLOBAL: $ => /[gG][lL][oO][bB][aA][lL]/,
    _GO: $ => /[gG][oO]/,
    _GOBACK: $ => /[gG][oO][bB][aA][cC][kK]/,
    _GREATER: $ => /[gG][rR][eE][aA][tT][eE][rR]/,
    _GROUP: $ => /[gG][rR][oO][uU][pP]/,
    _HEADING: $ => /[hH][eE][aA][dD][iI][nN][gG]/,
    _HIGHLIGHT: $ => /[hH][iI][gG][hH][lL][iI][gG][hH][tT]/,
    _HIGH_VALUE: $ => choice(
      'high-value', 'high-Value', 'high-VALUE',
      'High-value', 'High-Value', 'High-VALUE',
      'HIGH-value', 'HIGH-Value', 'HIGH-VALUE'
    ),
    _IDENTIFICATION: $ => /[iI][dD][eE][nN][tT][iI][fF][iI][cC][aA][tT][iI][oO][nN]/,
    _IF: $ => /[iI][fF]/,
    _IGNORE: $ => /[iI][gG][nN][oO][rR][eE]/,
    _IGNORING: $ => /[iI][gG][nN][oO][rR][iI][nN][gG]/,
    _IN: $ => /[iI][nN]/,
    _INDEX: $ => /[iI][nN][dD][eE][xX]/,
    _INDEXED: $ => /[iI][nN][dD][eE][xX][eE][dD]/,
    _INDICATE: $ => /[iI][nN][dD][iI][cC][aA][tT][eE]/,
    _INITIALIZE: $ => /[iI][nN][iI][tT][iI][aA][lL][iI][zZ][eE]/,
    _INITIALIZED: $ => /[iI][nN][iI][tT][iI][aA][lL][iI][zZ][eE][dD]/,
    _INITIATE: $ => /[iI][nN][iI][tT][iI][aA][tT][eE]/,
    _INPUT: $ => /[iI][nN][pP][uU][tT]/,
    _INPUT_OUTPUT: $ => /[iI][nN][pP][uU][tT]-[oO][uU][tT][pP][uU][tT]/,
    _INSPECT: $ => /[iI][nN][sS][pP][eE][cC][tT]/,
    _INTO: $ => /[iI][nN][tT][oO]/,
    _INTRINSIC: $ => /[iI][nN][tT][rR][iI][nN][sS][iI][cC]/,
    _INVALID: $ => /[iI][nN][vV][aA][lL][iI][dD]/,
    _INVALID_KEY: $ => /[iI][nN][vV][aA][lL][iI][dD]-[kK][eE][yY]/,
    _IS: $ => /[iI][sS]/,
    _I_O: $ => /[iI]-[oO]/,
    _I_O_CONTROL: $ => /[iI]-[oO]-[cC][oO][nN][tT][rR][oO][lL]/,
    _JUSTIFIED: $ => /[jJ][uU][sS][tT][iI][fF][iI][eE][dD]/,
    _KEY: $ => /[kK][eE][yY]/,
    _LABEL: $ => /[lL][aA][bB][eE][lL]/,
    _LAST: $ => /[lL][aA][sS][tT]/,
    _LAST_DETAIL: $ => /[lL][aA][sS][tT]-[dD][eE][tT][aA][iI][lL]/,
    _LE: $ => /[lL][eE]/,
    _LEADING: $ => /[lL][eE][aA][dD][iI][nN][gG]/,
    _LEFT: $ => /[lL][eE][fF][tT]/,
    _LENGTH: $ => /[lL][eE][nN][gG][tT][hH]/,
    _LESS: $ => /[lL][eE][sS][sS]/,
    _LEVEL_NUMBER_WORD: $ => /[lL][eE][vV][eE][lL]-[nN][uU][mM][bB][eE][rR]-[wW][oO][rR][dD]/,
    _LEVEL88_NUMBER_WORD: $ => /[lL][eE][vV][eE][lL]88-[nN][uU][mM][bB][eE][rR]-[wW][oO][rR][dD]/,
    _LIMIT: $ => /[lL][iI][mM][iI][tT]/,
    _LIMITS: $ => /[lL][iI][mM][iI][tT][sS]/,
    _LINAGE: $ => /[lL][iI][nN][aA][gG][eE]/,
    _LINAGE_COUNTER: $ => /[lL][iI][nN][aA][gG][eE]-[cC][oO][uU][nN][tT][eE][rR]/,
    _LINE: $ => /[lL][iI][nN][eE]/,
    _LINES: $ => /[lL][iI][nN][eE][sS]/,
    _LINKAGE: $ => /[lL][iI][nN][kK][aA][gG][eE]/,
    _LOCALE: $ => /[lL][oO][cC][aA][lL][eE]/,
    _LOCALE_DT_FUNC: $ => /[lL][oO][cC][aA][lL][eE]-[dD][tT]-[fF][uU][nN][cC]/,
    _LOCAL_STORAGE: $ => /[lL][oO][cC][aA][lL]-[sS][tT][oO][rR][aA][gG][eE]/,
    _LOCK: $ => /[lL][oO][cC][kK]/,
    _LOWER_CASE_FUNC: $ => /[lL][oO][wW][eE][rR]-[cC][aA][sS][eE]-[fF][uU][nN][cC]/,
    _LOWLIGHT: $ => /[lL][oO][wW][lL][iI][gG][hH][tT]/,
    _LOW_VALUE: $ => choice(
      'low-value', 'low-Value', 'low-VALUE',
      'Low-value', 'Low-Value', 'Low-VALUE',
      'LOW-value', 'LOW-Value', 'LOW-VALUE'
    ),
    _MANUAL: $ => /[mM][aA][nN][uU][aA][lL]/,
    _MEMORY: $ => /[mM][eE][mM][oO][rR][yY]/,
    _MERGE: $ => /[mM][eE][rR][gG][eE]/,
    _MINUS: $ => /[mM][iI][nN][uU][sS]/,
    //todo
    _MNEMONIC_NAME: $ => /[mM][nN][eE][mM][oO][nN][iI][cC]-[nN][aA][mM][eE]/,
    _MODE: $ => /[mM][oO][dD][eE]/,
    _MOVE: $ => /[mM][oO][vV][eE]/,
    _MULTIPLE: $ => /[mM][uU][lL][tT][iI][pP][lL][eE]/,
    _MULTIPLY: $ => /[mM][uU][lL][tT][iI][pP][lL][yY]/,
    _NATIONAL: $ => /[nN][aA][tT][iI][oO][nN][aA][lL]/,
    _NATIONAL_EDITED: $ => /[nN][aA][tT][iI][oO][nN][aA][lL]-[eE][dD][iI][tT][eE][dD]/,
    _NATIVE: $ => /[nN][aA][tT][iI][vV][eE]/,
    _NE: $ => /[nN][eE]/,
    _NEGATIVE: $ => /[nN][eE][gG][aA][tT][iI][vV][eE]/,
    _NEXT: $ => /[nN][eE][xX][tT]/,
    _NEXT_SENTENCE: $ => /[nN][eE][xX][tT]-[sS][eE][nN][tT][eE][nN][cC][eE]/,
    _NO: $ => /[nN][oO]/,
    _NOMINAL: $ => /[nN][oO][mM][iI][nN][aA][lL]/,
    _NOT: $ => /[nN][oO][tT]/,
    _NOT_END: $ => /[nN][oO][tT]-[eE][nN][dD]/,
    _NOT_EOP: $ => /[nN][oO][tT]-[eE][oO][pP]/,
    _NOT_EXCEPTION: $ => /[nN][oO][tT]-[eE][xX][cC][eE][pP][tT][iI][oO][nN]/,
    _NOT_INVALID_KEY: $ => /[nN][oO][tT]-[iI][nN][vV][aA][lL][iI][dD]-[kK][eE][yY]/,
    _NOT_OVERFLOW: $ => /[nN][oO][tT]-[oO][vV][eE][rR][fF][lL][oO][wW]/,
    _NOT_SIZE_ERROR: $ => /[nN][oO][tT]-[sS][iI][zZ][eE]-[eE][rR][rR][oO][rR]/,
    _NO_ADVANCING: $ => /[nN][oO]-[aA][dD][vV][aA][nN][cC][iI][nN][gG]/,
    _NUMBER: $ => /[nN][uU][mM][bB][eE][rR]/,
    _NUMBERS: $ => /[nN][uU][mM][bB][eE][rR][sS]/,
    _NUMERIC: $ => /[nN][uU][mM][eE][rR][iI][cC]/,
    _NUMERIC_EDITED: $ => /[nN][uU][mM][eE][rR][iI][cC]-[eE][dD][iI][tT][eE][dD]/,
    _NUMVALC_FUNC: $ => /[nN][uU][mM][vV][aA][lL][cC]-[fF][uU][nN][cC]/,
    _OBJECT_COMPUTER: $ => /[oO][bB][jJ][eE][cC][tT]-[cC][oO][mM][pP][uU][tT][eE][rR]/,
    _OCCURS: $ => /[oO][cC][cC][uU][rR][sS]/,
    _OF: $ => /[oO][fF]/,
    _OFF: $ => /[oO][fF][fF]/,
    _OMITTED: $ => /[oO][mM][iI][tT][tT][eE][dD]/,
    _ON: $ => /[oO][nN]/,
    _ONLY: $ => /[oO][nN][lL][yY]/,
    _OPEN: $ => /[oO][pP][eE][nN]/,
    _OPTIONAL: $ => /[oO][pP][tT][iI][oO][nN][aA][lL]/,
    _OR: $ => /[oO][rR]/,
    _ORDER: $ => /[oO][rR][dD][eE][rR]/,
    _ORGANIZATION: $ => /[oO][rR][gG][aA][nN][iI][zZ][aA][tT][iI][oO][nN]/,
    _OTHER: $ => /[oO][tT][hH][eE][rR]/,
    _OUTPUT: $ => /[oO][uU][tT][pP][uU][tT]/,
    _OVERFLOW: $ => /[oO][vV][eE][rR][fF][lL][oO][wW]/,
    _OVERLINE: $ => /[oO][vV][eE][rR][lL][iI][nN][eE]/,
    _PACKED_DECIMAL: $ => /[pP][aA][cC][kK][eE][dD]-[dD][eE][cC][iI][mM][aA][lL]/,
    _PADDING: $ => /[pP][aA][dD][dD][iI][nN][gG]/,
    _PAGE: $ => /[pP][aA][gG][eE]/,
    _PAGE_FOOTING: $ => /[pP][aA][gG][eE]-[fF][oO][oO][tT][iI][nN][gG]/,
    _PAGE_HEADING: $ => /[pP][aA][gG][eE]-[hH][eE][aA][dD][iI][nN][gG]/,
    _PARAGRAPH: $ => /[pP][aA][rR][aA][gG][rR][aA][pP][hH]/,
    _PERFORM: $ => /[pP][eE][rR][fF][oO][rR][mM]/,
    _PIC: $ => /[pP][iI][cC]/,
    _PICTURE: $ => /[pP][iI][cC][tT][uU][rR][eE]/,
    _PLUS: $ => /[pP][lL][uU][sS]/,
    _POINTER: $ => /[pP][oO][iI][nN][tT][eE][rR]/,
    _POSITION: $ => /[pP][oO][sS][iI][tT][iI][oO][nN]/,
    _POSITIVE: $ => /[pP][oO][sS][iI][tT][iI][vV][eE]/,
    _PRESENT: $ => /[pP][rR][eE][sS][eE][nN][tT]/,
    _PREVIOUS: $ => /[pP][rR][eE][vV][iI][oO][uU][sS]/,
    _PRINTER: $ => /[pP][rR][iI][nN][tT][eE][rR]/,
    _PRINTING: $ => /[pP][rR][iI][nN][tT][iI][nN][gG]/,
    _PROCEDURE: $ => /[pP][rR][oO][cC][eE][dD][uU][rR][eE]/,
    _PROCEDURES: $ => /[pP][rR][oO][cC][eE][dD][uU][rR][eE][sS]/,
    _PROCEED: $ => /[pP][rR][oO][cC][eE][eE][dD]/,
    _PROGRAM: $ => /[pP][rR][oO][gG][rR][aA][mM]/,
    _PROGRAM_ID: $ => /[pP][rR][oO][gG][rR][aA][mM]-[iI][dD]/,
    _PROGRAM_NAME: $ => /[pP][rR][oO][gG][rR][aA][mM]-[nN][aA][mM][eE]/,
    _PROGRAM_POINTER: $ => /[pP][rR][oO][gG][rR][aA][mM]-[pP][oO][iI][nN][tT][eE][rR]/,
    _PROMPT: $ => /[pP][rR][oO][mM][pP][tT]/,
    _QUOTE: $ => choice('quote', 'QUOTE', 'Quote'),
    _RANDOM: $ => /[rR][aA][nN][dD][oO][mM]/,
    _RD: $ => /[rR][dD]/,
    _READ: $ => /[rR][eE][aA][dD]/,
    _RECORD: $ => /[rR][eE][cC][oO][rR][dD]/,
    _RECORDING: $ => /[rR][eE][cC][oO][rR][dD][iI][nN][gG]/,
    _RECORDS: $ => /[rR][eE][cC][oO][rR][dD][sS]/,
    _RECURSIVE: $ => /[rR][eE][cC][uU][rR][sS][iI][vV][eE]/,
    _REDEFINES: $ => /[rR][eE][dD][eE][fF][iI][nN][eE][sS]/,
    _REEL: $ => /[rR][eE][eE][lL]/,
    _REFERENCE: $ => /[rR][eE][fF][eE][rR][eE][nN][cC][eE]/,
    _RELATIVE: $ => /[rR][eE][lL][aA][tT][iI][vV][eE]/,
    _RELEASE: $ => /[rR][eE][lL][eE][aA][sS][eE]/,
    _REMAINDER: $ => /[rR][eE][mM][aA][iI][nN][dD][eE][rR]/,
    _REMOVAL: $ => /[rR][eE][mM][oO][vV][aA][lL]/,
    _RENAMES: $ => /[rR][eE][nN][aA][mM][eE][sS]/,
    _REPLACING: $ => /[rR][eE][pP][lL][aA][cC][iI][nN][gG]/,
    _REPORT: $ => /[rR][eE][pP][oO][rR][tT]/,
    _REPORTING: $ => /[rR][eE][pP][oO][rR][tT][iI][nN][gG]/,
    _REPORTS: $ => /[rR][eE][pP][oO][rR][tT][sS]/,
    _REPORT_FOOTING: $ => /[rR][eE][pP][oO][rR][tT]-[fF][oO][oO][tT][iI][nN][gG]/,
    _REPORT_HEADING: $ => /[rR][eE][pP][oO][rR][tT]-[hH][eE][aA][dD][iI][nN][gG]/,
    _REPOSITORY: $ => /[rR][eE][pP][oO][sS][iI][tT][oO][rR][yY]/,
    _REQUIRED: $ => /[rR][eE][qQ][uU][iI][rR][eE][dD]/,
    _RESERVE: $ => /[rR][eE][sS][eE][rR][vV][eE]/,
    _RETURN: $ => /[rR][eE][tT][uU][rR][nN]/,
    _RETURNING: $ => /[rR][eE][tT][uU][rR][nN][iI][nN][gG]/,
    _REVERSE_FUNC: $ => /[rR][eE][vV][eE][rR][sS][eE]-[fF][uU][nN][cC]/,
    _REVERSE_VIDEO: $ => /[rR][eE][vV][eE][rR][sS][eE]-[vV][iI][dD][eE][oO]/,
    _REWIND: $ => /[rR][eE][wW][iI][nN][dD]/,
    _REWRITE: $ => /[rR][eE][wW][rR][iI][tT][eE]/,
    _RIGHT: $ => /[rR][iI][gG][hH][tT]/,
    _ROLLBACK: $ => /[rR][oO][lL][lL][bB][aA][cC][kK]/,
    _ROUNDED: $ => /[rR][oO][uU][nN][dD][eE][dD]/,
    _RUN: $ => /[rR][uU][nN]/,
    _SAME: $ => /[sS][aA][mM][eE]/,
    _SCREEN: $ => /[sS][cC][rR][eE][eE][nN]/,
    _SCREEN_CONTROL: $ => /[sS][cC][rR][eE][eE][nN]-[cC][oO][nN][tT][rR][oO][lL]/,
    _SCROLL: $ => /[sS][cC][rR][oO][lL][lL]/,
    _SD: $ => /[sS][dD]/,
    _SEARCH: $ => /[sS][eE][aA][rR][cC][hH]/,
    _SECTION: $ => /[sS][eE][cC][tT][iI][oO][nN]/,
    _SECURE: $ => /[sS][eE][cC][uU][rR][eE]/,
    _SEGMENT_LIMIT: $ => /[sS][eE][gG][mM][eE][nN][tT]-[lL][iI][mM][iI][tT]/,
    _SELECT: $ => /[sS][eE][lL][eE][cC][tT]/,
    _SEMI_COLON: $ => /[sS][eE][mM][iI]-[cC][oO][lL][oO][nN]/,
    _SENTENCE: $ => /[sS][eE][nN][tT][eE][nN][cC][eE]/,
    _SEPARATE: $ => /[sS][eE][pP][aA][rR][aA][tT][eE]/,
    _SEQUENCE: $ => /[sS][eE][qQ][uU][eE][nN][cC][eE]/,
    _SEQUENTIAL: $ => /[sS][eE][qQ][uU][eE][nN][tT][iI][aA][lL]/,
    _SET: $ => /[sS][eE][tT]/,
    _SHARING: $ => /[sS][hH][aA][rR][iI][nN][gG]/,
    _SIGN: $ => /[sS][iI][gG][nN]/,
    _SIGNED: $ => /[sS][iI][gG][nN][eE][dD]/,
    _SIGNED_INT: $ => /[sS][iI][gG][nN][eE][dD]-[iI][nN][tT]/,
    _SIGNED_LONG: $ => /[sS][iI][gG][nN][eE][dD]-[lL][oO][nN][gG]/,
    _SIGNED_SHORT: $ => /[sS][iI][gG][nN][eE][dD]-[sS][hH][oO][rR][tT]/,
    _SIZE: $ => /[sS][iI][zZ][eE]/,
    _SIZE_ERROR: $ => /[sS][iI][zZ][eE]-[eE][rR][rR][oO][rR]/,
    _SORT: $ => /[sS][oO][rR][tT]/,
    _SORT_MERGE: $ => /[sS][oO][rR][tT]-[mM][eE][rR][gG][eE]/,
    _SOURCE: $ => /[sS][oO][uU][rR][cC][eE]/,
    _SOURCE_COMPUTER: $ => /[sS][oO][uU][rR][cC][eE]-[cC][oO][mM][pP][uU][tT][eE][rR]/,
    _SPACE: $ => choice('space', 'SPACE', 'Space'),
    _SPECIAL_NAMES: $ => /[sS][pP][eE][cC][iI][aA][lL]-[nN][aA][mM][eE][sS]/,
    _STANDARD: $ => /[sS][tT][aA][nN][dD][aA][rR][dD]/,
    _STANDARD_1: $ => /[sS][tT][aA][nN][dD][aA][rR][dD]-1/,
    _STANDARD_2: $ => /[sS][tT][aA][nN][dD][aA][rR][dD]-2/,
    _START: $ => /[sS][tT][aA][rR][tT]/,
    _STATUS: $ => /[sS][tT][aA][tT][uU][sS]/,
    _STOP: $ => /[sS][tT][oO][pP]/,
    _STRING: $ => /[sS][tT][rR][iI][nN][gG]/,
    _SUBSTITUTE_FUNC: $ => /[sS][uU][bB][sS][tT][iI][tT][uU][tT][eE]-[fF][uU][nN][cC]/,
    _SUBSTITUTE_CASE_FUNC: $ => /[sS][uU][bB][sS][tT][iI][tT][uU][tT][eE]-[cC][aA][sS][eE]-[fF][uU][nN][cC]/,
    _SUBTRACT: $ => /[sS][uU][bB][tT][rR][aA][cC][tT]/,
    _SUM: $ => /[sS][uU][mM]/,
    _SUPPRESS: $ => /[sS][uU][pP][pP][rR][eE][sS][sS]/,
    _SYMBOLIC: $ => /[sS][yY][mM][bB][oO][lL][iI][cC]/,
    _SYNCHRONIZED: $ => /[sS][yY][nN][cC][hH][rR][oO][nN][iI][zZ][eE][dD]/,
    _TALLYING: $ => /[tT][aA][lL][lL][yY][iI][nN][gG]/,
    _TAPE: $ => /[tT][aA][pP][eE]/,
    _TERMINATE: $ => /[tT][eE][rR][mM][iI][nN][aA][tT][eE]/,
    _TEST: $ => /[tT][eE][sS][tT]/,
    _THAN: $ => /[tT][hH][aA][nN]/,
    _THEN: $ => /[tT][hH][eE][nN]/,
    _THRU: $ => /[tT][hH][rR][uU]/,
    _TIME: $ => /[tT][iI][mM][eE]/,
    _TIMES: $ => /[tT][iI][mM][eE][sS]/,
    _TO: $ => /[tT][oO]/,
    _TOK_FALSE: $ => /[fF][aA][lL][sS][eE]/,
    _FILE: $ => /[fF][iI][lL][eE]/,
    _TOK_INITIAL: $ => /[iI][nN][iI][tT][iI][aA][lL]/,
    _TOK_NULL: $ => choice('null', 'Null', 'NULL'),
    _TOK_TRUE: $ => /[tT][rR][uU][eE]/,
    _TOP: $ => /[tT][oO][pP]/,
    _TRACKS: $ => /[tT][rR][aA][cC][kK][sS]/,
    _TRAILING: $ => /[tT][rR][aA][iI][lL][iI][nN][gG]/,
    _TRANSFORM: $ => /[tT][rR][aA][nN][sS][fF][oO][rR][mM]/,
    _TRIM_FUNCTION: $ => /[tT][rR][iI][mM]-[fF][uU][nN][cC][tT][iI][oO][nN]/,
    _TYPE: $ => /[tT][yY][pP][eE]/,
    _UNDERLINE: $ => /[uU][nN][dD][eE][rR][lL][iI][nN][eE]/,
    _UNIT: $ => /[uU][nN][iI][tT]/,
    _UNLOCK: $ => /[uU][nN][lL][oO][cC][kK]/,
    _UNSIGNED: $ => /[uU][nN][sS][iI][gG][nN][eE][dD]/,
    _UNSIGNED_INT: $ => /[uU][nN][sS][iI][gG][nN][eE][dD]-[iI][nN][tT]/,
    _UNSIGNED_LONG: $ => /[uU][nN][sS][iI][gG][nN][eE][dD]-[lL][oO][nN][gG]/,
    _UNSIGNED_SHORT: $ => /[uU][nN][sS][iI][gG][nN][eE][dD]-[sS][hH][oO][rR][tT]/,
    _UNSTRING: $ => /[uU][nN][sS][tT][rR][iI][nN][gG]/,
    _UNTIL: $ => /[uU][nN][tT][iI][lL]/,
    _UP: $ => /[uU][pP]/,
    _UPDATE: $ => /[uU][pP][dD][aA][tT][eE]/,
    _UPON: $ => /[uU][pP][oO][nN]/,
    _UPON_ARGUMENT_NUMBER: $ => /[uU][pP][oO][nN]-[aA][rR][gG][uU][mM][eE][nN][tT]-[nN][uU][mM][bB][eE][rR]/,
    _UPON_COMMAND_LINE: $ => /[uU][pP][oO][nN]-[cC][oO][mM][mM][aA][nN][dD]-[lL][iI][nN][eE]/,
    _UPON_ENVIRONMENT_NAME: $ => /[uU][pP][oO][nN]-[eE][nN][vV][iI][rR][oO][nN][mM][eE][nN][tT]-[nN][aA][mM][eE]/,
    _UPON_ENVIRONMENT_VALUE: $ => /[uU][pP][oO][nN]-[eE][nN][vV][iI][rR][oO][nN][mM][eE][nN][tT]-[vV][aA][lL][uU][eE]/,
    _UPPER_CASE_FUNC: $ => /[uU][pP][pP][eE][rR]-[cC][aA][sS][eE]-[fF][uU][nN][cC]/,
    _USAGE: $ => /[uU][sS][aA][gG][eE]/,
    _USE: $ => /[uU][sS][eE]/,
    _USING: $ => /[uU][sS][iI][nN][gG]/,
    _VALUE: $ => /[vV][aA][lL][uU][eE]/,
    _VARYING: $ => /[vV][aA][rR][yY][iI][nN][gG]/,
    _WAIT: $ => /[wW][aA][iI][tT]/,
    _WHEN: $ => /[wW][hH][eE][nN]/,
    _WHEN_COMPILED_FUNC: $ => /[wW][hH][eE][nN]-[cC][oO][mM][pP][iI][lL][eE][dD]-[fF][uU][nN][cC]/,
    _WHEN_OTHER: $ => /[wW][hH][eE][nN]-[oO][tT][hH][eE][rR]/,
    _WITH: $ => /[wW][iI][tT][hH]/,
    _WORD: $ => /[a-zA-z_][a-zA-Z0-9_\-]*/,
    _WORDS: $ => /[wW][oO][rR][dD][sS]/,
    _WORKING_STORAGE: $ => /[wW][oO][rR][kK][iI][nN][gG]-[sS][tT][oO][rR][aA][gG][eE]/,
    _WRITE: $ => /[wW][rR][iI][tT][eE]/,
    _YYYYDDD: $ => /[yY][yY][yY][yY][dD][dD][dD]/,
    _YYYYMMDD: $ => /[yY][yY][yY][yY][mM][mM][dD][dD]/,
    _ZERO: $ => choice('zero', 'ZERO', 'Zero'),


    ACCEPT: $ => $._ACCEPT,
    ACCESS: $ => $._ACCESS,
    ADD: $ => $._ADD,
    ADDRESS: $ => $._ADDRESS,
    ADVANCING: $ => $._ADVANCING,
    AFTER: $ => $._AFTER,
    ALL: $ => $._ALL,
    ALLOCATE: $ => $._ALLOCATE,
    ALPHABET: $ => $._ALPHABET,
    ALPHABETIC: $ => $._ALPHABETIC,
    ALPHABETIC_LOWER: $ => $._ALPHABETIC_LOWER,
    ALPHABETIC_UPPER: $ => $._ALPHABETIC_UPPER,
    ALPHANUMERIC: $ => $._ALPHANUMERIC,
    ALPHANUMERIC_EDITED: $ => $._ALPHANUMERIC_EDITED,
    ALSO: $ => $._ALSO,
    ALTER: $ => $._ALTER,
    ALTERNATE: $ => $._ALTERNATE,
    AND: $ => $._AND,
    ANY: $ => $._ANY,
    APPLY: $ => $._APPLY,
    ARE: $ => $._ARE,
    AREA: $ => $._AREA,
    ARGUMENT_NUMBER: $ => $._ARGUMENT_NUMBER,
    ARGUMENT_VALUE: $ => $._ARGUMENT_VALUE,
    AS: $ => $._AS,
    ASCENDING: $ => $._ASCENDING,
    ASSIGN: $ => $._ASSIGN,
    AT: $ => $._AT,
    AUTO: $ => $._AUTO,
    AUTOMATIC: $ => $._AUTOMATIC,
    BACKGROUND_COLOR: $ => $._BACKGROUND_COLOR,
    BASED: $ => $._BASED,
    BEFORE: $ => $._BEFORE,
    BELL: $ => $._BELL,
    BINARY: $ => $._BINARY,
    BINARY_C_LONG: $ => $._BINARY_C_LONG,
    BINARY_CHAR: $ => $._BINARY_CHAR,
    BINARY_DOUBLE: $ => $._BINARY_DOUBLE,
    BINARY_LONG: $ => $._BINARY_LONG,
    BINARY_SHORT: $ => $._BINARY_SHORT,
    BLANK: $ => $._BLANK,
    BLANK_LINE: $ => $._BLANK_LINE,
    BLANK_SCREEN: $ => $._BLANK_SCREEN,
    BLINK: $ => $._BLINK,
    BLOCK: $ => $._BLOCK,
    BOTTOM: $ => $._BOTTOM,
    BY: $ => $._BY,
    BYTE_LENGTH: $ => $._BYTE_LENGTH,
    CALL: $ => $._CALL,
    CANCEL: $ => $._CANCEL,
    CH: $ => $._CH,
    CHAINING: $ => $._CHAINING,
    CHARACTER: $ => $._CHARACTER,
    CHARACTERS: $ => $._CHARACTERS,
    CLASS: $ => $._CLASS,
    CLASS_NAME: $ => $._CLASS_NAME,
    CLOSE: $ => $._CLOSE,
    CLOSE_NOFEED: $ => $._CLOSE_NOFEED,
    CODE: $ => $._CODE,
    CODE_SET: $ => $._CODE_SET,
    COLLATING: $ => $._COLLATING,
    COL: $ => $._COL,
    COLS: $ => $._COLS,
    COLUMN: $ => $._COLUMN,
    COLUMNS: $ => $._COLUMNS,
    COMMA: $ => $._COMMA,
    COMMAND_LINE: $ => $._COMMAND_LINE,
    COMMA_DELIM: $ => $._COMMA_DELIM,
    COMMIT: $ => $._COMMIT,
    COMMITMENT_CONTROL: $ => $._COMMITMENT_CONTROL,
    COMMON: $ => $._COMMON,
    COMP: $ => $._COMP,
    COMPUTE: $ => $._COMPUTE,
    COMP_1: $ => $._COMP_1,
    COMP_2: $ => $._COMP_2,
    COMP_3: $ => $._COMP_3,
    COMP_4: $ => $._COMP_4,
    COMP_5: $ => $._COMP_5,
    COMP_X: $ => $._COMP_X,
    CONCATENATE_FUNC: $ => $._CONCATENATE_FUNC,
    CONFIGURATION: $ => $._CONFIGURATION,
    CONSTANT: $ => $._CONSTANT,
    CONTAINS: $ => $._CONTAINS,
    CONTENT: $ => $._CONTENT,
    CONTINUE: $ => $._CONTINUE,
    CONTROL: $ => $._CONTROL,
    CONTROLS: $ => $._CONTROLS,
    CONTROL_FOOTING: $ => $._CONTROL_FOOTING,
    CONTROL_HEADING: $ => $._CONTROL_HEADING,
    CONVERTING: $ => $._CONVERTING,
    CORE_INDEX: $ => $._CORE_INDEX,
    CORRESPONDING: $ => $._CORRESPONDING,
    COUNT: $ => $._COUNT,
    CRT: $ => $._CRT,
    CURRENCY: $ => $._CURRENCY,
    CURRENT_DATE_FUNC: $ => $._CURRENT_DATE_FUNC,
    CURSOR: $ => $._CURSOR,
    CYCLE: $ => $._CYCLE,
    CYL_OVERFLOW: $ => $._CYL_OVERFLOW,
    DATA: $ => $._DATA,
    DATE: $ => $._DATE,
    DAY: $ => $._DAY,
    DAY_OF_WEEK: $ => $._DAY_OF_WEEK,
    DE: $ => $._DE,
    DEBUGGING: $ => $._DEBUGGING,
    DECIMAL_POINT: $ => $._DECIMAL_POINT,
    DECLARATIVES: $ => $._DECLARATIVES,
    DEFAULT: $ => $._DEFAULT,
    DELETE: $ => $._DELETE,
    DELIMITED: $ => $._DELIMITED,
    DELIMITER: $ => $._DELIMITER,
    DEPENDING: $ => $._DEPENDING,
    DESCENDING: $ => $._DESCENDING,
    DETAIL: $ => $._DETAIL,
    DISK: $ => $._DISK,
    DISPLAY: $ => $._DISPLAY,
    DIVIDE: $ => $._DIVIDE,
    DIVISION: $ => $._DIVISION,
    DOWN: $ => $._DOWN,
    DUPLICATES: $ => $._DUPLICATES,
    DYNAMIC: $ => $._DYNAMIC,
    EBCDIC: $ => $._EBCDIC,
    ELSE: $ => $._ELSE,
    END: $ => $._END,
    END_ACCEPT: $ => $._END_ACCEPT,
    END_ADD: $ => $._END_ADD,
    END_CALL: $ => $._END_CALL,
    END_COMPUTE: $ => $._END_COMPUTE,
    END_DELETE: $ => $._END_DELETE,
    END_DISPLAY: $ => $._END_DISPLAY,
    END_DIVIDE: $ => $._END_DIVIDE,
    END_EVALUATE: $ => $._END_EVALUATE,
    END_FUNCTION: $ => $._END_FUNCTION,
    END_IF: $ => $._END_IF,
    END_MULTIPLY: $ => $._END_MULTIPLY,
    END_PERFORM: $ => $._END_PERFORM,
    END_PROGRAM: $ => $._END_PROGRAM,
    END_READ: $ => $._END_READ,
    END_RETURN: $ => $._END_RETURN,
    END_REWRITE: $ => $._END_REWRITE,
    END_SEARCH: $ => $._END_SEARCH,
    END_START: $ => $._END_START,
    END_STRING: $ => $._END_STRING,
    END_SUBTRACT: $ => $._END_SUBTRACT,
    END_UNSTRING: $ => $._END_UNSTRING,
    END_WRITE: $ => $._END_WRITE,
    ENTRY: $ => $._ENTRY,
    ENVIRONMENT: $ => $._ENVIRONMENT,
    ENVIRONMENT_NAME: $ => $._ENVIRONMENT_NAME,
    ENVIRONMENT_VALUE: $ => $._ENVIRONMENT_VALUE,
    EOL: $ => $._EOL,
    EOP: $ => $._EOP,
    EOS: $ => $._EOS,
    EQUAL: $ => $._EQUAL,
    EQUALS: $ => $._EQUALS,
    ERASE: $ => $._ERASE,
    ERROR: $ => $._ERROR,
    ESCAPE: $ => $._ESCAPE,
    EVALUATE: $ => $._EVALUATE,
    EVENT_STATUS: $ => $._EVENT_STATUS,
    EXCEPTION: $ => $._EXCEPTION,
    EXCLUSIVE: $ => $._EXCLUSIVE,
    EXIT: $ => $._EXIT,
    EXTEND: $ => $._EXTEND,
    EXTERNAL: $ => $._EXTERNAL,
    FD: $ => $._FD,
    FILE_CONTROL: $ => $._FILE_CONTROL,
    FILE_ID: $ => $._FILE_ID,
    FILLER: $ => $._FILLER,
    FINAL: $ => $._FINAL,
    FIRST: $ => $._FIRST,
    FOOTING: $ => $._FOOTING,
    FOR: $ => $._FOR,
    FOREGROUND_COLOR: $ => $._FOREGROUND_COLOR,
    FOREVER: $ => $._FOREVER,
    FORMS_OVERLAY: $ => $._FORMS_OVERLAY,
    FREE: $ => $._FREE,
    FROM: $ => $._FROM,
    FULL: $ => $._FULL,
    FUNCTION: $ => $._FUNCTION,
    FUNCTION_ID: $ => $._FUNCTION_ID,
    FUNCTION_NAME: $ => $._FUNCTION_NAME,
    GE: $ => $._GE,
    GENERATE: $ => $._GENERATE,
    GIVING: $ => $._GIVING,
    GLOBAL: $ => $._GLOBAL,
    GO: $ => $._GO,
    GOBACK: $ => $._GOBACK,
    GREATER: $ => $._GREATER,
    GROUP: $ => $._GROUP,
    HEADING: $ => $._HEADING,
    HIGHLIGHT: $ => $._HIGHLIGHT,
    HIGH_VALUE: $ => $._HIGH_VALUE,
    IDENTIFICATION: $ => $._IDENTIFICATION,
    IF: $ => $._IF,
    IGNORE: $ => $._IGNORE,
    IGNORING: $ => $._IGNORING,
    IN: $ => $._IN,
    INDEX: $ => $._INDEX,
    INDEXED: $ => $._INDEXED,
    INDICATE: $ => $._INDICATE,
    INITIALIZE: $ => $._INITIALIZE,
    INITIALIZED: $ => $._INITIALIZED,
    INITIATE: $ => $._INITIATE,
    INPUT: $ => $._INPUT,
    INPUT_OUTPUT: $ => $._INPUT_OUTPUT,
    INSPECT: $ => $._INSPECT,
    INTO: $ => $._INTO,
    INTRINSIC: $ => $._INTRINSIC,
    INVALID: $ => $._INVALID,
    INVALID_KEY: $ => $._INVALID_KEY,
    IS: $ => $._IS,
    I_O: $ => $._I_O,
    I_O_CONTROL: $ => $._I_O_CONTROL,
    JUSTIFIED: $ => $._JUSTIFIED,
    KEY: $ => $._KEY,
    LABEL: $ => $._LABEL,
    LAST: $ => $._LAST,
    LAST_DETAIL: $ => $._LAST_DETAIL,
    LE: $ => $._LE,
    LEADING: $ => $._LEADING,
    LEFT: $ => $._LEFT,
    LENGTH: $ => $._LENGTH,
    LESS: $ => $._LESS,
    LEVEL_NUMBER_WORD: $ => $._LEVEL_NUMBER_WORD,
    LEVEL88_NUMBER_WORD: $ => $._LEVEL88_NUMBER_WORD,
    LIMIT: $ => $._LIMIT,
    LIMITS: $ => $._LIMITS,
    LINAGE: $ => $._LINAGE,
    LINAGE_COUNTER: $ => $._LINAGE_COUNTER,
    LINE: $ => $._LINE,
    LINES: $ => $._LINES,
    LINKAGE: $ => $._LINKAGE,
    LITERAL: $ => $._LITERAL,
    LOCALE: $ => $._LOCALE,
    LOCALE_DT_FUNC: $ => $._LOCALE_DT_FUNC,
    LOCAL_STORAGE: $ => $._LOCAL_STORAGE,
    LOCK: $ => $._LOCK,
    LOWER_CASE_FUNC: $ => $._LOWER_CASE_FUNC,
    LOWLIGHT: $ => $._LOWLIGHT,
    LOW_VALUE: $ => $._LOW_VALUE,
    MANUAL: $ => $._MANUAL,
    MEMORY: $ => $._MEMORY,
    MERGE: $ => $._MERGE,
    MINUS: $ => $._MINUS,
    MNEMONIC_NAME: $ => $._MNEMONIC_NAME,
    MODE: $ => $._MODE,
    MOVE: $ => $._MOVE,
    MULTIPLE: $ => $._MULTIPLE,
    MULTIPLY: $ => $._MULTIPLY,
    NATIONAL: $ => $._NATIONAL,
    NATIONAL_EDITED: $ => $._NATIONAL_EDITED,
    NATIVE: $ => $._NATIVE,
    NE: $ => $._NE,
    NEGATIVE: $ => $._NEGATIVE,
    NEXT: $ => $._NEXT,
    NEXT_SENTENCE: $ => $._NEXT_SENTENCE,
    NO: $ => $._NO,
    NOMINAL: $ => $._NOMINAL,
    NOT: $ => $._NOT,
    NOT_END: $ => $._NOT_END,
    NOT_EOP: $ => $._NOT_EOP,
    NOT_EXCEPTION: $ => $._NOT_EXCEPTION,
    NOT_INVALID_KEY: $ => $._NOT_INVALID_KEY,
    NOT_OVERFLOW: $ => $._NOT_OVERFLOW,
    NOT_SIZE_ERROR: $ => $._NOT_SIZE_ERROR,
    NO_ADVANCING: $ => $._NO_ADVANCING,
    NUMBER: $ => $._NUMBER,
    NUMBERS: $ => $._NUMBERS,
    NUMERIC: $ => $._NUMERIC,
    NUMERIC_EDITED: $ => $._NUMERIC_EDITED,
    NUMVALC_FUNC: $ => $._NUMVALC_FUNC,
    OBJECT_COMPUTER: $ => $._OBJECT_COMPUTER,
    OCCURS: $ => $._OCCURS,
    OF: $ => $._OF,
    OFF: $ => $._OFF,
    OMITTED: $ => $._OMITTED,
    ON: $ => $._ON,
    ONLY: $ => $._ONLY,
    OPEN: $ => $._OPEN,
    OPTIONAL: $ => $._OPTIONAL,
    OR: $ => $._OR,
    ORDER: $ => $._ORDER,
    ORGANIZATION: $ => $._ORGANIZATION,
    OTHER: $ => $._OTHER,
    OUTPUT: $ => $._OUTPUT,
    OVERFLOW: $ => $._OVERFLOW,
    OVERLINE: $ => $._OVERLINE,
    PACKED_DECIMAL: $ => $._PACKED_DECIMAL,
    PADDING: $ => $._PADDING,
    PAGE: $ => $._PAGE,
    PAGE_FOOTING: $ => $._PAGE_FOOTING,
    PAGE_HEADING: $ => $._PAGE_HEADING,
    PARAGRAPH: $ => $._PARAGRAPH,
    PERFORM: $ => $._PERFORM,
    PIC: $ => $._PIC,
    PICTURE: $ => $._PICTURE,
    PLUS: $ => $._PLUS,
    POINTER: $ => $._POINTER,
    POSITION: $ => $._POSITION,
    POSITIVE: $ => $._POSITIVE,
    PRESENT: $ => $._PRESENT,
    PREVIOUS: $ => $._PREVIOUS,
    PRINTER: $ => $._PRINTER,
    PRINTING: $ => $._PRINTING,
    PROCEDURE: $ => $._PROCEDURE,
    PROCEDURES: $ => $._PROCEDURES,
    PROCEED: $ => $._PROCEED,
    PROGRAM: $ => $._PROGRAM,
    PROGRAM_ID: $ => $._PROGRAM_ID,
    PROGRAM_NAME: $ => $._PROGRAM_NAME,
    PROGRAM_POINTER: $ => $._PROGRAM_POINTER,
    PROMPT: $ => $._PROMPT,
    QUOTE: $ => $._QUOTE,
    RANDOM: $ => $._RANDOM,
    RD: $ => $._RD,
    READ: $ => $._READ,
    RECORD: $ => $._RECORD,
    RECORDING: $ => $._RECORDING,
    RECORDS: $ => $._RECORDS,
    RECURSIVE: $ => $._RECURSIVE,
    REDEFINES: $ => $._REDEFINES,
    REEL: $ => $._REEL,
    REFERENCE: $ => $._REFERENCE,
    RELATIVE: $ => $._RELATIVE,
    RELEASE: $ => $._RELEASE,
    REMAINDER: $ => $._REMAINDER,
    REMOVAL: $ => $._REMOVAL,
    RENAMES: $ => $._RENAMES,
    REPLACING: $ => $._REPLACING,
    REPORT: $ => $._REPORT,
    REPORTING: $ => $._REPORTING,
    REPORTS: $ => $._REPORTS,
    REPORT_FOOTING: $ => $._REPORT_FOOTING,
    REPORT_HEADING: $ => $._REPORT_HEADING,
    REPOSITORY: $ => $._REPOSITORY,
    REQUIRED: $ => $._REQUIRED,
    RESERVE: $ => $._RESERVE,
    RETURN: $ => $._RETURN,
    RETURNING: $ => $._RETURNING,
    REVERSE_FUNC: $ => $._REVERSE_FUNC,
    REVERSE_VIDEO: $ => $._REVERSE_VIDEO,
    REWIND: $ => $._REWIND,
    REWRITE: $ => $._REWRITE,
    RIGHT: $ => $._RIGHT,
    ROLLBACK: $ => $._ROLLBACK,
    ROUNDED: $ => $._ROUNDED,
    RUN: $ => $._RUN,
    SAME: $ => $._SAME,
    SCREEN: $ => $._SCREEN,
    SCREEN_CONTROL: $ => $._SCREEN_CONTROL,
    SCROLL: $ => $._SCROLL,
    SD: $ => $._SD,
    SEARCH: $ => $._SEARCH,
    SECTION: $ => $._SECTION,
    SECURE: $ => $._SECURE,
    SEGMENT_LIMIT: $ => $._SEGMENT_LIMIT,
    SELECT: $ => $._SELECT,
    SEMI_COLON: $ => $._SEMI_COLON,
    SENTENCE: $ => $._SENTENCE,
    SEPARATE: $ => $._SEPARATE,
    SEQUENCE: $ => $._SEQUENCE,
    SEQUENTIAL: $ => $._SEQUENTIAL,
    SET: $ => $._SET,
    SHARING: $ => $._SHARING,
    SIGN: $ => $._SIGN,
    SIGNED: $ => $._SIGNED,
    SIGNED_INT: $ => $._SIGNED_INT,
    SIGNED_LONG: $ => $._SIGNED_LONG,
    SIGNED_SHORT: $ => $._SIGNED_SHORT,
    SIZE: $ => $._SIZE,
    SIZE_ERROR: $ => $._SIZE_ERROR,
    SORT: $ => $._SORT,
    SORT_MERGE: $ => $._SORT_MERGE,
    SOURCE: $ => $._SOURCE,
    SOURCE_COMPUTER: $ => $._SOURCE_COMPUTER,
    SPACE: $ => $._SPACE,
    SPECIAL_NAMES: $ => $._SPECIAL_NAMES,
    STANDARD: $ => $._STANDARD,
    STANDARD_1: $ => $._STANDARD_1,
    STANDARD_2: $ => $._STANDARD_2,
    START: $ => $._START,
    STATUS: $ => $._STATUS,
    STOP: $ => $._STOP,
    STRING: $ => $._STRING,
    SUBSTITUTE_FUNC: $ => $._SUBSTITUTE_FUNC,
    SUBSTITUTE_CASE_FUNC: $ => $._SUBSTITUTE_CASE_FUNC,
    SUBTRACT: $ => $._SUBTRACT,
    SUM: $ => $._SUM,
    SUPPRESS: $ => $._SUPPRESS,
    SYMBOLIC: $ => $._SYMBOLIC,
    SYNCHRONIZED: $ => $._SYNCHRONIZED,
    TALLYING: $ => $._TALLYING,
    TAPE: $ => $._TAPE,
    TERMINATE: $ => $._TERMINATE,
    TEST: $ => $._TEST,
    THAN: $ => $._THAN,
    THEN: $ => $._THEN,
    THRU: $ => $._THRU,
    TIME: $ => $._TIME,
    TIMES: $ => $._TIMES,
    TO: $ => $._TO,
    TOK_FALSE: $ => $._TOK_FALSE,
    FILE: $ => $._FILE,
    TOK_INITIAL: $ => $._TOK_INITIAL,
    TOK_NULL: $ => $._TOK_NULL,
    TOK_TRUE: $ => $._TOK_TRUE,
    TOP: $ => $._TOP,
    TRACKS: $ => $._TRACKS,
    TRAILING: $ => $._TRAILING,
    TRANSFORM: $ => $._TRANSFORM,
    TRIM_FUNCTION: $ => $._TRIM_FUNCTION,
    TYPE: $ => $._TYPE,
    UNDERLINE: $ => $._UNDERLINE,
    UNIT: $ => $._UNIT,
    UNLOCK: $ => $._UNLOCK,
    UNSIGNED: $ => $._UNSIGNED,
    UNSIGNED_INT: $ => $._UNSIGNED_INT,
    UNSIGNED_LONG: $ => $._UNSIGNED_LONG,
    UNSIGNED_SHORT: $ => $._UNSIGNED_SHORT,
    UNSTRING: $ => $._UNSTRING,
    UNTIL: $ => $._UNTIL,
    UP: $ => $._UP,
    UPDATE: $ => $._UPDATE,
    UPON: $ => $._UPON,
    UPON_ARGUMENT_NUMBER: $ => $._UPON_ARGUMENT_NUMBER,
    UPON_COMMAND_LINE: $ => $._UPON_COMMAND_LINE,
    UPON_ENVIRONMENT_NAME: $ => $._UPON_ENVIRONMENT_NAME,
    UPON_ENVIRONMENT_VALUE: $ => $._UPON_ENVIRONMENT_VALUE,
    UPPER_CASE_FUNC: $ => $._UPPER_CASE_FUNC,
    USAGE: $ => $._USAGE,
    USE: $ => $._USE,
    USING: $ => $._USING,
    VALUE: $ => $._VALUE,
    VARYING: $ => $._VARYING,
    WAIT: $ => $._WAIT,
    WHEN: $ => $._WHEN,
    WHEN_COMPILED_FUNC: $ => $._WHEN_COMPILED_FUNC,
    WHEN_OTHER: $ => $._WHEN_OTHER,
    WITH: $ => $._WITH,
    WORD: $ => $._WORD,
    WORDS: $ => $._WORDS,
    WORKING_STORAGE: $ => $._WORKING_STORAGE,
    WRITE: $ => $._WRITE,
    YYYYDDD: $ => $._YYYYDDD,
    YYYYMMDD: $ => $._YYYYMMDD,
    ZERO: $ => $._ZERO,

  }
});