/* 
包含n个用于间接修改状态数据的方法的对象
*/

import Cookies from 'js-cookie'
import {reqAddress,reqCategorys,reqShops } from '../api'

import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER, 
  RESET_USER,
  RECEIVE_TOKEN
} from './mutation-types'


export default {
    /* 
    获取当前地址的异步action
    */
   async getAddress({commit,state}){
      const {longitude,latitude} = state
      //发送异步ajax请求
      const result = await reqAddress(longitude,latitude)
      //有结果，提交mutation
      if(result.code===0){
          const address = result.data
          commit(RECEIVE_ADDRESS,address)
      }
   },

   /* 
    获取分类列表的异步action
    */
   async getCategorys({commit},callback){
    //发送异步ajax请求
    const result = await reqCategorys()
    //有结果，提交mutation
    if(result.code===0){
        const categorys = result.data
        commit(RECEIVE_CATEGORYS,categorys)
        //在更新状态数据后执行回调函数
        typeof callback === 'function' && callback() //发通知
    }
 },

 /* 
    获取商家列表的异步action
    */
   async getShops({commit,state}){
    const {longitude,latitude} = state
    //发送异步ajax请求
    const result = await reqShops({longitude,latitude})
    //有结果，提交mutation
    if(result.code===0){
        const shops = result.data
        commit(RECEIVE_SHOPS,shops)
    }
 },

 //记录user：持久化保存token  在state中保存user
 recordUser({commit},user){
   //将user的token保存到localStorage中
   localStorage.setItem('token_key',user.token)
   //将token保存到state中
   commit(RECEIVE_TOKEN,{token:user.token})
   //将uesr保存到state中
   delete user.token
   commit(RECEIVE_USER,{user})
 },

 /* 退出登录 */
 logout ({commit}){
   //重置状态中user
   commit(RESET_USER)
   //清楚local中保存的token
   localStorage.removeItem('token_key')
   //清除从cookie中的user_id
   Cookies.remove('user_id')
 }
}