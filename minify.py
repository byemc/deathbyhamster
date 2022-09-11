import os, requests, tinify
from dotenv import load_dotenv

load_dotenv()

tinify.key = os.environ.get("tinify_key")

output_dir = "build/"

blacklist = [
    "logothing.png"
]

for ff in os.listdir():
    if ff.endswith(".png"):
        if (ff == "logothing.png"):
            continue
        print(ff)
        source = tinify.from_file(ff)
        source.to_file(f'{output_dir}{ff}')
    elif ff.endswith(".mp3"):
        fle = open(ff, "rb")
        dst = open(f'{output_dir}{ff}', "wb+")
        dst.write(fle.read())
        fle.close()
        dst.close()

os.system(f"terser lzs.js letters.js game.js --mangle --compress -o {output_dir}code.js")
os.system(f"rm {output_dir}dbh.zip")
os.system(f"advzip {output_dir}dbh.zip --add build --shrink-insane -4")

progress = os.path.getsize(f"{output_dir}dbh.zip") / 1024

# make a loading bar showing progress to 13KB
print(f"[{'#'*(int((progress/13)*100)//10)}] {((progress/13)*100)}% ({round(progress, 3)} KB / 13 KB)")
