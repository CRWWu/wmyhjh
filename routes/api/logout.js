let express = require('express')
let router = express.Router()

router.delete('/',(req,res,next)=>{
  console.log('logout')
  req.session['wmy_user']=undefined;
  res.send({err:0,msg:'注销成功'})
});

module.exports=router;