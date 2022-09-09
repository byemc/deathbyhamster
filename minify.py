import os

for ff in os.listdir():
    if (ff.endswith(".png")):
        print(ff)
