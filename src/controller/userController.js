import User from "../models/user";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join",{pageTitle:"join"})
export const postJoin = async(req, res) => {
    const {profileImg, name, email, username, password, password2, location} = req.body;
    if(password !== password2){
        return res.status(400).render("join",{pageTitle:"join",errorMessage:"password confirmation does not match"})
    }
    const exist = await User.exists({$or:[{username}, {email}] });
    if(exist) {
        return res.status(400).render("join",{pageTitle:"join",errorMessage:"This username/email is already taken"})
    }
    await User.create({
        profileImg,
        name,
        email,
        username,
        password,
        password2,
        location
    });
    return res.redirect("/login")
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id :process.env.GH_CLIENT,
        allow_signup : false,
        scope: "read:user user:email"
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async(req,res) => {
    const baseUrl = "https://github.com/login/oauth/access_token"
    const config = {
       client_id:process.env.GH_CLIENT,
       client_secret:process.env.GH_SECRET,
       code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl,{
            method:"POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await(
            await fetch(`${apiUrl}/user`,{
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json(); 
        console.log(JSON.stringify(userData));
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`,{
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj){
            return res.redirect("/login")
        }
        console.log(emailObj);
        let user = await User.findOne({email: emailObj.email});
        if(!user) {
            user = await User.create({
                avatarUrl:userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password:"",
                socialOnly: true,
                location: userData.location,
            });
           console.log(user);
        }
        req.session.loggedIn = true;
        req.session.user = user;
        req.session.user.socialOnly = true;
        console.log(req.session.user + ":::req.session.user");
        return res.redirect("/")
        
    }else{
        return res.redirect("/login")
    }
}

export const getLogin = (req, res) => res.render("login",{pageTitle:"Login"});
export const postLogin = async(req,res) => {
    const pageTitle = "Login";
    const {username, password} = req.body;
    const user = await User.findOne({username, socialOnly: false});
    if(!user){
        return res.status(400).render("login",{pageTitle,errorMessage:"일치하는 계정 정보가 없습니다"})
    };
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login",{pageTitle,errorMessage:"Wrong password"})
    };
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/")
};
export const getEdit = (req,res)=> {
    const avatar = req.session.user.avatarUrl;
    return res.render("edit-profile",{pageTitle:"Edit Profile",avatar})
}
export const postEdit = async(req,res) => {
    const {
        session: {
            user: {_id, avatarUrl},
        },
        body: {  
            name,
            email,
            username,
            location
        },
        file,
    }  = req;
    const newInfo = await User.findByIdAndUpdate(_id,{
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username,
        location
    });
    // if(newInfo.username == req.session.user.username && newInfo.email == req.session.user.email){
    //     return
    // }
    const existUsername = await User.exists({username});
    const existEmail = await User.exists({email});
    if(newInfo.username !== req.session.user.username && existUsername) {
        return res.status(400).render("edit-profile",{pageTitle:"Edit Profile",errorMessage:"이미 존재하는 닉네임입니다."})
    }
    if(newInfo.email !== req.session.user.email && existEmail){
        return res.status(400).render("edit-profile",{pageTitle:"Edit Profile",errorMessage:"이미 존재하는 이메일입니다."})
    }
    const updatedUser = await User.findByIdAndUpdate(_id,{
    name,email,username,location
    },
    {new:true}
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit")

}

export const getChangePassword = (req,res) => {
    if(req.session.user.socialOnly === true){
        return res.redirect("/");
    }
    return res.render("users/change-password", {pageTitle:"Change Password"})
}
export const postChangePassword =async(req,res) => {
    const {
        session: {
            user: {_id}
        },body :{oldPassword,newPassword,newPasswordConfirmation}
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if(!ok){
        return res.status(400).render("users/change-password", {
            pageTitle:"Change Password",
            errorMessage: "The current password is incorrect"
        })
    }
    if(newPassword !== newPasswordConfirmation) {
        return res.status(400).render("users/change-password", {
            pageTitle:"Change Password",
            errorMessage: "The password does not match the confirmation"
        })
    }
    
    user.password = newPassword;
    await user.save();
    return res.redirect("/users/logout")
}
//.populate("videos")지웠음
export const see = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path:"videos",
        populate : {
            path:"owner",
            model:"User",
        },
    });
    if(!user){
        return res.status(404).render("404", {pageTitle:"User not found"})
    }
    return res.render("users/profile", {pageTitle:user.name, user})
}