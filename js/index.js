/**
 * 解析歌词
 * {time:歌词开始时间,words:歌词内容}
 */
function parseLrc() {
    //划分为行
    var lines = lrc.split('\n')
    var result = []
    for(var i = 0; i<lines.length; i++){
        var obj = {
            time:'',
            words:''
        }
        //time与words分开，结果是数组： ['[00:00.000', ' 原唱 : 王宇宙Leto/乔浚丞']
        var parts = lines[i].split(']')
        obj.words = parts[1]
        //时间转化为数字
        timeStr = parts[0].substring(1)
        obj.time = parseTime(timeStr)
        result.push(obj)
    }
    return result
} 
/**
 * 时间字符串解析为数值
 * @param {String} timeStr 
 */
function parseTime(timeStr){
    // 以“:”为分隔符
    var parts = timeStr.split(':')
    return  (+parts[0]*60 + +parts[1])
}

var lrcData = parseLrc()

//需要获取的dom
var doms={
    audio: document.querySelector("audio"),
    ul: document.querySelector(".container ul"),
    container: document.querySelector(".container")

}

/**
 * 获取当期时间下应播放歌词的下标
 */
function findIndex(){
    var currentTime = doms.audio.currentTime //控制台显示
    for(var i = 0; i < lrcData.length ;i++){
        if(currentTime < lrcData[i].time)
        {
            return i - 1
        }
    }
    return (lrcData.length-1)//最后一句返回最后一个下标
}

/**
 * 创建歌词元素
 */
function createLrcElements(){
    var frag = document.createDocumentFragment()
    for(var i = 0; i < lrcData.length; i++)
    {
        var li = document.createElement('li')
        li.textContent = lrcData[i].words
        frag.appendChild(li) //改动了dom树，有效率问题 一句歌词加一次dom =>先加到代码片段里，再将片段加到dom树中
    }
    doms.ul.appendChild(frag)
}
createLrcElements()


var containerHeight = doms.container.clientHeight//容器的height
var liHeight = doms.ul.children[0].clientHeight
var maxOffset = doms.ul.clientHeight - containerHeight
/**
 * 计算ul偏移量
 */
function setOffset(){
    var index = findIndex()
    var height = index*liHeight + liHeight/2 
    var offset = height - containerHeight/2
    if(offset < 0)
    {
        offset = 0
    }
    if(offset > maxOffset)
    {
        offset = maxOffset
    }

    //需要把之前的active行样式去掉
    var li = doms.ul.querySelector('.active')
    if(li)
    {
        li.classList.remove('active')
    }
   
    //刚开始时，index可能为-1
    li = doms.ul.children[index]
    if(li)
    {
        li.classList.add('active')
    }
    
    doms.ul.style.transform = `translateY(-${offset}px)`
}

doms.audio.addEventListener('timeupdate',setOffset)