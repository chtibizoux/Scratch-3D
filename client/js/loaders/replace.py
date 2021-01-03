from os import listdir, getcwd
from os.path import isfile, join
import re
path = getcwd()
onlyfiles = [f for f in listdir(path) if isfile(join(path, f)) and ".py" not in f]
for file in onlyfiles:
    openFile = open(join(path, file), "r")
    content = openFile.read()
    openFile.close()
    content = re.sub(r'\n\s*\n', '\n', content)
    content = content.replace(' }', '}')
    content = content.replace(' ]', ']')
    content = content.replace(' )', ')')
    content = content.replace('{ ', '{')
    content = content.replace('[ ', '{')
    content = content.replace('( ', '(')
    if "} from" in content :
        imports = content[content.index("import {") + 8:content.index("} from")].replace('\n', '').replace('\t', '').replace(' ', '').split(',')
        for value in imports:
            content = content.replace(' ' + value, ' THREE.' + value)
    if "export {" in content:
        content = content[content.index(";") + 1:content.index("export {")]
    if "import {" in content:
        content = content[content.index(";") + 1:]
    openFile = open(join(path, file), "w")
    openFile.write(content)
    openFile.close()
