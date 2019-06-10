<template>
  <div
    :id="id" :style="{width:width + 'px',height:height + 'px', margin:'34px auto'}"
    class="m-map"></div>
</template>

<script>
    export default {
      props:{
        width: {
          type: Number,
          default: 300
        },
        height: {
          type: Number,
          default: 300
        },
        point: {
          type: Array,
          default(){
            return []
          }
        }
      },
      data(){
        return {
          id: `map`,
          key: '5afada466b1867dcfa1021588e18aca3'
        }
      },
      watch: {
        point: function (val, old){
          this.map.setCenter(val);
          this.marker.setPosition(val);
        }
      },
      mounted(){
        let self = this;
        self.id = `map${Math.random().toString().slice(4, 6)}`;

        window.onmaploaded = () => {
          let map = new window.AMap.Map(self.id, {
            resizeEnable: true,
            center: self.point[0].center.split(","),
            zoom: 11
          });
          self.map =map;


          let icon = new AMap.Icon({
            size: new AMap.Size(40, 50),
            image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',  // Icon的图像
            imageSize: new AMap.Size(30, 40)   // 根据所设置的大小拉伸或压缩图片
          });

          for(let i=0;i<self.point.length;i++) {
            let tempMarker = new AMap.Marker({
              icon: icon,
              position: self.point[i].center.split(","),
              offset: new AMap.Pixel(-60, 30)
            });
            map.add(tempMarker)
          }

          window.AMap.plugin('AMap.ToolBar', () => {
            let toolbar = new window.AMap.ToolBar();
            map.addControl(toolbar);

          })
        }

        const url = `https://webapi.amap.com/maps?v=1.4.10&key=${self.key}&callback=onmaploaded`;
        let jsapi = document.createElement('script');
        jsapi.charset = 'utf-8';
        jsapi.src = url;
        document.head.appendChild(jsapi);
      }
    }
</script>
