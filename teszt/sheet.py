import sys
from PIL import Image
fs=sys.argv[2:]; out=sys.argv[1]; cols=3
ims=[Image.open(f) for f in fs]; w=min(560,ims[0].width); r=w/ims[0].width; h=int(ims[0].height*r)
S=Image.new('RGB',(cols*w+(cols-1)*6,((len(ims)+cols-1)//cols)*(h+6)),'white')
for i,im in enumerate(ims): S.paste(im.resize((w,h)),((i%cols)*(w+6),(i//cols)*(h+6)))
S.save(out,quality=70)
