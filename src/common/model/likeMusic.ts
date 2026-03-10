import { likeMusic as likeMusicApi } from "@/api/music";
import type { LikeMusicParam } from "@/api/music/type";
import { HttpStatusCode } from "axios";
import { ElMessage } from "element-plus";

/**
 * 喜欢音乐
 * @description 说明 : 调用此接口 , 传入音乐 id, 可喜欢该音乐
 * @param {String | Number} params.id: 歌曲 id `必选`
 * @param {Boolean} params.like: 布尔值 , 默认为 true 即喜欢 , 若传 false, 则取消喜欢 `必选`
 */
export function likeMUsic(params: LikeMusicParam): Promise<HttpStatusCode> {
  return new Promise((resolve, reject) => {
    likeMusicApi(params).then((res) => {
      const { code } = res.data
      if (code != 202) {
        return reject(code)
      }
      resolve(code)
      params.like ? ElMessage.success("已添加到我喜欢的音乐") : ElMessage.success("取消喜欢")
    }).catch(() => {
      ElMessage.error("喜欢音乐失败")
    })
  })
}