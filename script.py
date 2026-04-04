import re
import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def rpl(m):
        prefix = m.group(1) # kc or fc
        cat = m.group(2)
        num = m.group(3)

        kw = cat.replace('-', ',')
        if prefix == 'kc':
            kw = 'kitchen,' + kw
        elif prefix == 'fc':
             kw = 'furniture,' + kw
             
        # refine some keywords
        kw = kw.replace('tandems', 'drawer').replace('ss,trolleys', 'kitchen,trolley').replace('pantry', 'pantry').replace('rolling,shutter', 'cabinet').replace('wicker', 'wicker,basket').replace('crockery', 'crockery,cabinet').replace('platform', 'kitchen,countertop').replace('mandir', 'hindu,temple').replace('tall,unit', 'kitchen,cabinet').replace('loft', 'cabinet').replace('hydraulic,bed', 'bed').replace('drawer,bed', 'bed').replace('wall,bed', 'bed').replace('headboard', 'headboard').replace('wardrobe', 'wardrobe').replace('side,tables', 'side,table').replace('study,table', 'desk').replace('book,rack', 'bookshelf').replace('loft,storage', 'cabinet').replace('wall,decor,bed', 'wall,decor').replace('tv,unit', 'tv,unit')
        
        return f'src="https://loremflickr.com/800/600/{kw}?lock={num}"'
        
    new_content = re.sub(r'src="images/(kc|fc)-([^"/]+)-(\d+)\.jpg"', rpl, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f'Processed {filepath}, changed: {content != new_content}')

process_file('modular-kitchens.html')
process_file('custom-furniture.html')
