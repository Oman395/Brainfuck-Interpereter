{ADD},>{SUB},>{MULT},>{DIV},>{ONE},>{ONECPY}>${TWO},>{TWOCPY}>{RESULT}>{ZERO}>{1}>{REMAINDER} Set variables
{ADD} Adding mode
[
    {TWO} Add input two to result
    [
        {RESULT}
        + Add to result
        {TWO}
        - Subtract from input two
    ]
    {ONE} Same but for one
    [
        {RESULT}
        +
        {ONE}
        -
    ]
    {ADD}
    -
]
{SUB} Subtracting mode
[ Literally the exact same as adding but with subtraction
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
{MULT} Multiplying mode
[
    {ONE}
    [ Loop for input one
        {TWO}
        [ Loop for two
            {RESULT}
            + Add two result
            {TWOCPY}
            + Add to two copy
            {TWO}
            - Subtract from two
        ]
        {TWOCPY} Move two copy to two and set two copy to zero
        [
            {TWO}
            +
            {TWOCPY}
            -
        ]
        {ONE}
        - Subtract from one
    ]
    {MULT}
    - End Multiplying
]
{DIV} Dividing mode
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