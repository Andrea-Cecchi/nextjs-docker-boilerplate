#!/usr/bin/env python3
import sys

print("Arguments:", sys.argv)
print("Length:", len(sys.argv))

if len(sys.argv) > 1:
    print("First arg:", sys.argv[1])
    if sys.argv[1] == "--test-csv":
        print("TEST CSV MODE ACTIVATED")
    else:
        print("NORMAL MODE")
else:
    print("NO ARGS MODE")