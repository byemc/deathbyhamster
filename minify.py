import os, requests, tinify
from dotenv import load_dotenv

load_dotenv()

tinify.key = os.environ.get("tinify_key")

output_dir = "build/"

blacklist = [
    "logothing.png"
]

for ff in os.listdir():
    if (ff.endswith(".png")):
        if (ff == "logothing.png"):
            continue
        print(ff)
        source = tinify.from_file(ff)
        source.to_file(f'{output_dir}{ff}')

os.system(f"terser lzs.js letters.js game.js --mangle --compress -o {output_dir}code.js")
os.system(f"advzip {output_dir}dbh.zip --add build --shrink-insane -4")
