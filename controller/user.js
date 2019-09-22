const Router=require('koa-router');
let router=new Router();
const mongoose=require('mongoose');

router.post('/registUser', async (ctx) => {
    // 获取model
    const User = mongoose.model('User');
    // 接收post请求封装成user对象
    let newUser = new User(ctx.request.body);
    // 使用save保存用户信息
    await newUser.save().then(() => {
        ctx.body = {
            code: 200,
            message: '注册成功'
        };
    }).catch(err => {
        ctx.body = {
            code: 500,
            message: err
        };
    });
});


router.post('/loginUser', async (ctx) => {
    let loginUser=ctx.request.body;
    let userName=loginUser.userName;
    let password=loginUser.password;
    // 获取model
    const User = mongoose.model('User');
    // 查询用户名
    await User.findOne({userName:userName}).exec().then(async (result)=>{
        if(result){
            let newUser=new User();
            await newUser.comparePassword(password,result.password).then(isMatch=>{
                if(isMatch){
                    ctx.body={
                        code:200,
                        message:'登陆成功'
                    }
                }else{
                    ctx.body={
                        code:201,
                        message:'登陆失败'
                    }
                }
            })
        }else{
            ctx.body={
                code:201,
                message:'用户名不存在'
            }
        }
    })
   
});
module.exports=router;