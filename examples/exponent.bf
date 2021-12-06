{TGT},>{EXP},>{RES}>{CPY1}>{CPY2} variables
This program is insane good luck lmfao
{TGT}
[ Make a copy of target in copy 1
This will allow us to multiply by it
    {CPY1}+
    {CPY2}+
    {TGT}-
]
{CPY2}
[ Reset target
    {TGT}+
    {CPY2}-
]
{EXP}- Exponent is one less b/c we start at ^1
[
    {TGT}
    [ Loop for target
        {CPY1}
        [ Loop for original target copy
            {RES}+ add to result
            {CPY2}+ add to copy 2
            {CPY1}- subtract from copy 1
        ]
        {CPY2}
        [ Move copy 2 to copy 1
            {CPY1}+
            {CPY2}-
        ]
        {TGT}- Subtract from target
    ]
    {RES}
    [ Set target to res and res to 0
    This allows us to then loop and multiply our previous result and save that to res
        {TGT}+
        {RES}-
    ]
    {EXP}- Reduce so loop isnt infinite
    Not that we could tell if it was or not 
    halting problem goes brrrr
]
{TGT}. output