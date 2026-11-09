# index.html összeállítása: a logó darabjai az introhoz
B='/home/user/darling/'
s=open(B+'forras/index.src.html').read().replace('{{LOGO_PARTS}}',open(B+'forras/logo-parts.html').read())
open(B+'site/index.html','w').write(s)
print('ok',len(s))
