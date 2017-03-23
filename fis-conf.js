/*
* ��ĿĿ¼
* components   (�������ڲ���д��һЩ���к���)
*       --common
*           --host-config.js    �����õ���IP��
*           --url.js    ��������Ŀ��ҳ��·����
*           --common.js     ��һЩ�����ܺ����װ��
*       --widget    ���������һЩ�����
* lib   (��������ⲿ��ȡ�Ŀ�,��jquery��bootstr)
*       --js
*       --styles
* views  (ҳ��)
* */


/*
������Ŀ��������ͬһ��������Ŀ¼���ж����Ŀ�����Խ�·���ӵ���Ŀ����
eg��www/ ��Ŀ¼
      --���� ��Ŀ¼
     --����  ��Ŀ¼
�������϶�Ӧ�µ�ĳ����ĿΪ
     fis.config.set('project',"����/��Ŀ��");
*/
fis.config.set('project',"fcmg-bulid");

/*
 * ����rquireģ��·��
 * */
fis.hook('amd',{
    /*baseUrl: './',*/
    paths: {
        $:"lib/js/zepto.min",
        avalon:"lib/js/avalon.shim",
        weui:"lib/js/jquery-weui"
    },
    shim: {  //依赖
         'weui': {
            deps: ["$"]
         }
    }
});

//�� fis3 ��������ָ��Ŀ¼
fis.match('**', {
   deploy: fis.plugin('local-deliver', {
         to: 'F:\\taihe_iot\\'
   })
 })
