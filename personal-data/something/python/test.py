# -*- coding: UTF-8 -*-
import requests
import json
import urllib

# https://image.baidu.com/search/acjson?&queryWord=%E6%A1%8C%E9%9D%A2%E5%A3%81%E7%BA%B8&word=%E6%A1%8C%E9%9D%A2%E5%A3%81%E7%BA%B8
def getSogouImag(pageLen, path):
    n = pageLen
    m = 0
    for num in range(0, n):
        pn = 30*num
        imgs = requests.get('https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E6%A1%8C%E9%9D%A2%E5%A3%81%E7%BA%B8&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=&z=&ic=&hd=&latest=&copyright=&word=%E6%A1%8C%E9%9D%A2%E5%A3%81%E7%BA%B8&s=&se=&tab=&width=1920&height=&face=&istype=&qc=&nc=&fr=&expermode=&force=&cg=wallpaper&pn='+str(pn)+'&rn=30&gsm=78&1556009996650=')
        # print imgs
        jd = json.loads(imgs.text)
        jd = jd['data']
        imgs_url = []
        for j in jd:
            if j:
                # print j['thumbURL']
                imgs_url.append(j['thumbURL'])
        for img_url in imgs_url:
            print('***** '+str(m)+'.jpg *****'+'   Downloading...')
            urllib.urlretrieve(img_url, path+str(m)+'.jpg')
            m = m + 1
    print('Download complete!')


getSogouImag(10, 'C:/myDownImg/')
