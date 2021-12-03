LOCS:
ARG1 $0
ARG2 $1
ARG2C $2
FINAL $3
,>,< Sets arg1 and arg2
[ While arg1 not null
    > Switch to arg2
    [ While arg2 not null
        >+ Switch to arg2c and add to it
        >+ switch to final and add to it
        <<- Switch to arg2 and subtract from it
    ] End while
    > Switch to arg2c
    [ While arg2c not null
        <+ Switch to arg2 and add to it
        >- Switch to arg2c and subtract from it
    ] End while
    <<- Switch to arg1 and subtract from it
]
>>>. Switch to final and output it