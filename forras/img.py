# Képek: forrás -> webp (800/1400/2400), egységes, enyhén meleg tónus
import sys
from PIL import Image, ImageEnhance
B='/home/user/darling/'
L={
 'hero':('gm/gm00.jpg',[800,1400,2400]),
 'bar':('gm/gm04.jpg',[800,1400,2200]),
 'terasz':('gm/gm21.jpg',[800,1400,2200]),
 'terasz2':('gm/gm18.jpg',[800,1400,2200]),
 'asztal':('gm/gm11.jpg',[800,1400]),
 'zold':('ig/ig08.jpg',[800,1400]),
 'k-mule':('gm/gm03.jpg',[600,1100]),'k-sour':('gm/gm08.jpg',[600,1100]),'k-tiki':('gm/gm13.jpg',[600,1100]),
 'k-hab':('gm/gm15.jpg',[600,1100]),'k-rozsa':('gm/gm17.jpg',[600,1100]),'k-zold':('gm/gm19.jpg',[600,1100]),
 'k-narancs':('gm/gm20.jpg',[600,1100]),'k-sour2':('gm/gm22.jpg',[600,1100]),'k-mojito':('gm/gm23.jpg',[600,1100]),'k-gin':('gm/gm24.jpg',[600,1100]),
 'sor':('gm/gm25.jpg',[600,1100]),
 'f-burger':('gm/gm35.jpg',[800,1400]),'f-burger2':('gm/gm05.jpg',[800,1400]),'f-poke':('gm/gm07.jpg',[800,1400]),
 'f-bowls':('gm/gm16.jpg',[800,1400]),'f-bowl':('gm/gm39.jpg',[800,1400]),'f-nachos':('gm/gm06.jpg',[800,1400]),
 'f-bowl3':('gm/gm34.jpg',[800,1400]),
 'w-burger':('up/darling-up-w-burger.png',[800,1400]),'w-hotdog':('up/darling-up-w-hotdog.png',[800,1400]),
 'w-wrap':('up/darling-up-w-wrap.png',[800,1400]),'w-poke':('up/darling-up-w-poke.png',[800,1400]),
 'w-strips':('up/darling-up-w-strips.png',[800,1400]),'w-rings':('up/darling-up-w-rings.png',[800,1400]),
}
for n,(src,ws) in L.items():
  im=Image.open(B+src).convert('RGB')
  import numpy as np
  a=np.asarray(im.convert('L'));c=np.where(a.mean(0)<235)[0];r=np.where(a.mean(1)<235)[0]
  if len(c) and len(r) and (c[0]>3 or r[0]>3):
    m=6;im=im.crop((c[0]+m,r[0]+m,c[-1]-m,r[-1]-m))
  for w in ws:
    if w>im.width: continue
    r=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    r.save(f'{B}site/img/{n}-{w}.webp',quality=80 if w<2000 else 74,method=6)
  print(n,im.size,end='; ')
