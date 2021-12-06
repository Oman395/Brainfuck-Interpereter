{ADD},>{SUB},>{MULT},>{DIV},>{ONE},>{ONECPY}>${TWO},>{TWOCPY}>{RESULT}>{ZERO}>{1}>{REMAINDER}
{ADD}
[
    {TWO}
    [
        {RESULT}
        +
        {TWO}
        -
    ]
    {ONE}
    [
        {RESULT}
        +
        {ONE}
        -
    ]
    {ADD}
    -
]
{SUB}
[
    {ONE}
    [
        {RESULT}
        +
        {ONE}
        -
    ]
    {TWO}
    [
        {RESULT}
        -
        {TWO}
        -
    ]
    {SUB}
    -
]
{MULT}
[
    {ONE}
    [
        {TWO}
        [
            {RESULT}
            +
            {TWOCPY}
            +
            {TWO}
            -
        ]
        {TWOCPY}
        [
            {TWO}
            +
            {TWOCPY}
            -
        ]
        {ONE}
        -
    ]
    {MULT}
    -
]
{DIV}
[ Imma explain this shit here b/c its fucked tbh
    {ONE} Copy one to onecpy its a surprise tool that will help us later
    i bugged it for a moment by accidentally using a comma lol
    [
        {ONECPY}+
        {TWOCPY}+
        {ONE}-
    ]
    {TWOCPY}
    [
        {ONE}+
        {TWOCPY}-
    ]
    {ONE}
    [ Figures out how many times we can subtract two from one b4 it becomes negetive
        {TWO}
        [
            {ONE}-
            {TWOCPY}+
            {REMAINDER}+ counts number of times we subtract from one
            {TWO}-
        ]
        {TWOCPY}
        [
            {TWO}+
            {TWOCPY}-
        ]
        {RESULT}+
        {ONE}
    ]
    {ONECPY}
    [ reduce remainder by original to get difference
        {REMAINDER}-
        {ONECPY}-
    ]
    {REMAINDER}
    [ reduce two by remainder
        {TWO}-
        {REMAINDER}-
    ]
    {TWO}
    [ add two to the remainder (equivalent is one result value) to balance out
        {REMAINDER}+
        {TWO}-
    ]
    {RESULT}- this guy right here
    {DIV}
    -
]
{ADD}
{RESULT}.
{REMAINDER}. the only real limitation to this code is that when the divide function is presented with something like 4 / 4 it returns 0 remainder 4
i cant be assed fixing it it took long enough to write as is

<<>><<>> this isnt anything
test { this doesnt close
