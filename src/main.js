const LineAPI = require('./api');
const { Message, OpType, Location } = require('../curve-thrift/line_types');
let exec = require('child_process').exec;

// Thanks to my Team @TNB For Support:)

const myBot = ['uc4670540ac3b113403a9667df0b09df3','uc9bee7a0634cc1aefbe460acb9b7762d']; // Note: Jangan lupa dibagian myBot = ['isi mid kalian']
var vx = {};var midnornama,pesane,kickhim;var waitMsg = "no";//DO NOT CHANGE THIS//
var banList = [];//GAUSAH DIISI GAGUNA//
var bcText = "Isi Text Buat Broadcast";

//OH IYA JANGAN LUPA ISI MID LU DI BAGIAN MYBOT BIAR BOT NGERESPON SOALNYA NI HUSUS SELF//

function isAdminOrBot(param) {
    return myBot.includes(param);
}

function isAdmin(param) {
	return myAdmin.includes(param);
}

function isAgler(param) {
	return myAdmin.includes(param);
}

function isBanned(banList, param) {
    return banList.includes(param);
}

function firstToUpperCase(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function isTGet(string,param){
	return string.includes(param);
}

class LINE extends LineAPI {
    constructor() {
        super();
        this.receiverID = '';
        this.checkReader = [];
        this.sendBanlist = 0;
        this.stateStatus = {
            cancel: 1,
            kick: 1,
			sambut: 0,
			autoread: 1,
			autorespon: 1,
			mute: 0
        }              
		this.helpagler = `==============================
?W???????????????I?????????????? ???B??B??O????T? ????S????????????
==============================
? [Halo]
? [Ag:Clean]
? [Ag:Ban]
? [Ag:Unban]
? [Ag:Banlist]
? [Ag:Speed]
? [Ag:Cancel]
? [Ag:Kickall]
? [Ag:Tag]
? [Ag:Broadcast]
? [Ag:Setpoint]
? [Ag:Clear]
? [Ag:Recheck]
? [Ag:Myid]
==============================
- Wib Bots Settings Commands -
==============================
? [Kick on/off]
? [Cancel on/off]
? [Sambut on/off]
? [Autoread on/off]
? [Autorespon on/off]
? [Ag:Status/Setting]
? [Ag:Mute/Unmute]
==============================
O??????????????????????????????????????????????????????????????????????S?????????????????????????????????????????????????????????? W?????????????????????????????????????????????????????????????I??????????????????????????????????????????????????????????B??????????????????????????????????????????????????????????????????? B????????????????????????????????????????????????????????O??????????????????????????????????????????????????????????T???????????????????????????????????????????????????????????????????? C????????????????????????????????????????????????????????????????O????????????????????????????????????????????????????????????????????N?????????????????????????????????????????????????????????????? T??????????????????????????????????????????????????????R???????????????????????????????????????????????????????????O???????????????????????????????????????????????????????????L??????????????????????????????????????????????????????
==============================`;
    }
	
    getOprationType(operations) {
        for (let key in OpType) {
            if(operations.type == OpType[key]) {
                if(key !== 'NOTIFIED_UPDATE_PROFILE') {
                    console.info(`[* ${operations.type} ] ${key} `);
                }
            }
        }
    }

    poll(operation) {
        if(operation.type == 25 || operation.type == 26) {
            const txt = (operation.message.text !== '' && operation.message.text != null ) ? operation.message.text : '' ;
            let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === myBot[0]) ? operation.message.from : operation.message.to ;
            Object.assign(message,{ ct: operation.createdTime.toString() });
            if(waitMsg == "yes" && operation.message.from == vx[0] && this.stateStatus.mute != 1){
				this.textMessage(txt,message,message.text)
			}else if(this.stateStatus.mute != 1){this.textMessage(txt,message);
			}else if(txt == "ag:unmute" && isAdminOrBot(operation.message.from) && this.stateStatus.mute == 1){
			    this.stateStatus.mute = 0;
			    this._sendMessage(message,"?(^?^)?")
		    }else{console.info("Bot OFF");}
        }

        if(operation.type == 13 && this.stateStatus.cancel == 1) {
            this.cancelAll(operation.param1);
        }
		
		if(operation.type == 43 || operation.type == 41 || operation.type == 24 || operation.type == 15 || operation.type == 21){console.info(operation);}
		
		if(operation.type == 16 && this.stateStatus.sambut == 1){//join group
			let halo = new Message();
			halo.to = operation.param1;
			halo.text = "Halo, Salam Kenal :)";
			this._client.sendMessage(0, halo);
		}         
		
		if(operation.type == 17 && this.stateStatus.sambut == 1 && isAdminOrBot(operation.param2)) {//ada yang join
		    let halobos = new Message();
			halobos.to = operation.param1;
			halobos.toType = 2;
			halobos.text = "Halo kak, selamat datang di group jangan suka coli ya!";
			this._client.sendMessage(0, halobos);
		}else if(operation.type == 17 && this.stateStatus.salam == 1){//ada yang join
			let seq = new Message();
			seq.to = operation.param1;
			//halo.siapa = operation.param2;
			this.textMessage("0101",seq,operation.param2);
			//this._client.sendMessage(0, halo);
		}
		
		if(operation.type == 15 && isAdminOrBot(operation.param2)) {//ada yang leave
		    let babay = new Message();
			babay.to = operation.param1;
			babay.toType = 2;
			babay.text = "Yah kok leave? Dasar baperan :(";
			this._invite(operation.param1,[operation.param2]);
			this._client.sendMessage(0, babay);
		}else if(operation.type == 15 && !isAdminOrBot(operation.param2)){
			let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0102",seq,operation.param2);
		}
	
           if(operation.type == 26 && this.stateStatus.autoread == 1) {
        	let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === myBot[0]) ? operation.message.from : operation.message.to;
            Object.assign(message,{ ct: operation.createdTime.toString() });
             this._client.sendChatChecked(0, operation.message.to, operation.message.id);
            }
            
           if(operation.type == 26 && this.stateStatus.autoread == 1) {
        	let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === myBot[0]) ? operation.message.from : operation.message.to;
            Object.assign(message,{ ct: operation.createdTime.toString() });
             this._client.sendChatChecked(0, operation.message.from, operation.message.id);
            }

        if(operation.type == 19) { //ada kick
            // op1 = group nya
            // op2 = yang 'nge' kick
            // op3 = yang 'di' kick
			let kasihtau = new Message();
			kasihtau.to = operation.param1;
			kasihtau.toType = 2;
			kasihtau.contentType = 0;
            if(isAdminOrBot(operation.param3)) {
                this._invite(operation.param1,[operation.param3]);
				kasihtau.text = "Jangan main kick! ";
				this._client.sendMessage(0, kasihtau);
				var kickhim = 'yes';
            }
            if(!isAdminOrBot(operation.param3)){
                this._invite(operation.param1,[operation.param3]);
				kasihtau.text = "Jangan main kick !";
				this._client.sendMessage(0, kasihtau);
            } 
			if(kickhim=='yes'){
				if(!isAdminOrBot(operation.param2)){
				    this._kickMember(operation.param1,[operation.param2]);
				}var kickhim = 'no';
			}

        }
        
	if (seq.contentMetadata.MENTION && this.stateStatus.autorespon == 1 && !isAdminOrBot(seq.from_)) {
      console.info("Ada Yang Ngetag");
      let ment = seq.contentMetadata.MENTION;
      let xment = JSON.parse(ment);
      let zment = xment.MENTIONEES;
      for (var item of zment) {
        let men = item.M;
        if (myBot.includes(men)) {
          let tex = new Message();
          tex.to = seq.to
          tex.text = "Hey don't tag me, I'm busy!";
          this._client.sendMessage(0, tex);
        }
      }
    }        

        if(operation.type == 55){ //ada reader

            const idx = this.checkReader.findIndex((v) => {
                if(v.group == operation.param1) {
                    return v
                }
            })
            if(this.checkReader.length < 1 || idx == -1) {
                this.checkReader.push({ group: operation.param1, users: [operation.param2], timeSeen: [operation.param3] });
            } else {
                for (var i = 0; i < this.checkReader.length; i++) {
                    if(this.checkReader[i].group == operation.param1) {
                        if(!this.checkReader[i].users.includes(operation.param2)) {
                            this.checkReader[i].users.push(operation.param2);
                            this.checkReader[i].timeSeen.push(operation.param3);
                        }
                    }
                }
            }
        }

        if(operation.type == 13) { // diinvite
            if(isAdminOrBot(operation.param2)) {
                return this._acceptGroupInvitation(operation.param1);
            } else {
                return this._cancel(operation.param1,myBot);
            }
        }
        this.getOprationType(operation);
    }

    async cancelAll(gid) {
        let { listPendingInvite } = await this.searchGroup(gid);
        if(listPendingInvite.length > 0){
            this._cancel(gid,listPendingInvite);
        }
    }

    async searchGroup(gid) {
        let listPendingInvite = [];
        let thisgroup = await this._getGroups([gid]);
        if(thisgroup[0].invitee !== null) {
            listPendingInvite = thisgroup[0].invitee.map((key) => {
                return key.mid;
            });
        }
        let listMember = thisgroup[0].members.map((key) => {
            return { mid: key.mid, dn: key.displayName };
        });

        return { 
            listMember,
            listPendingInvite
        }
    }
	
	async matchPeople(param, nama) {
	    for (var i = 0; i < param.length; i++) {
            let orangnya = await this._client.getContacts([param[i]]);
		    if(orangnya[0].displayName == nama){
			    return orangnya;
				break;
		    }
        }
	}
	
	async searchRoom(rid) {
        let thisroom = await this._getRoom(rid);
        let listMemberr = thisroom.contacts.map((key) => {
            return { mid: key.mid, dn: key.displayName };
        });

        return { 
            listMemberr
        }
    }

//    setState(seq) {
//        if(isAdminOrBot(seq.from)){
//            let [ actions , status ] = seq.text.split(' ');
//            const action = actions.toLowerCase();
//            const state = status.toLowerCase() == 'on' ? 1 : 0;
//            this.stateStatus[action] = state;
//            this._sendMessage(seq,`Status: \n${JSON.stringify(this.stateStatus)}`);
//        } else {
//            this._sendMessage(seq,`(?????)??`);
//        }
//    }

    setState(seq,param) {
		if(param == 1){
			let isinya = "[Status Ag~Bot]\n";
			for (var k in this.stateStatus){
                if (typeof this.stateStatus[k] !== 'function') {
					if(this.stateStatus[k]==1){
						isinya += "\n"+firstToUpperCase(k)+" ? ON";
					}else{
						isinya += "\n"+firstToUpperCase(k)+" ? OFF";
					}
                }
            }this._sendMessage(seq,isinya);
		}else{
        if(isAdmin(seq.from) || isAgler(seq.from)){
            let [ actions , status ] = seq.text.split(' ');
            const action = actions.toLowerCase();
            const state = status.toLowerCase() == 'on' ? 1 : 0;
            this.stateStatus[action] = state;
			let isinya = "[Status Ag~Bot]\n";
			for (var k in this.stateStatus){
                if (typeof this.stateStatus[k] !== 'function') {
					if(this.stateStatus[k]==1){
						isinya += "\n"+firstToUpperCase(k)+" ? ON";
					}else{
						isinya += "\n"+firstToUpperCase(k)+" ? OFF";
					}
                }
            }
            //this._sendMessage(seq,`Status: \n${JSON.stringify(this.stateStatus)}`);
			this._sendMessage(seq,isinya);
        } else {
            this._sendMessage(seq,`Mohon Maaf Anda Bukan Admin~`);
        }}
    }

    mention(listMember) {
        let mentionStrings = [''];
        let mid = [''];
        for (var i = 0; i < listMember.length; i++) {
            mentionStrings.push('@'+listMember[i].displayName+'\n');
            mid.push(listMember[i].mid);
        }
        let strings = mentionStrings.join('');
        let member = strings.split('@').slice(1);
        
        let tmp = 0;
        let memberStart = [];
        let mentionMember = member.map((v,k) => {
            let z = tmp += v.length + 1;
            let end = z - 1;
            memberStart.push(end);
            let mentionz = `{"S":"${(isNaN(memberStart[k - 1] + 1) ? 0 : memberStart[k - 1] + 1 ) }","E":"${end}","M":"${mid[k + 1]}"}`;
            return mentionz;
        })
        return {
            names: mentionStrings.slice(1),
            cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }
        }
    }
	
	async tagAlls(seq,param1,param2){
		let { listMember } = await this.searchGroup(seq.to);
			seq.text = "";
			let mentionMemberx = [];
            for (var i = param1; i < param2; i++) {
				if(seq.text == null || typeof seq.text === "undefined" || !seq.text){
					let namanya = listMember[i].displayName;//.dn;
				    let midnya = listMember[i].mid;
				    seq.text += "@"+namanya+" ";
                    let member = [namanya];
        
                    let tmp = 0;
                    let mentionMember1 = member.map((v,k) => {
                        let z = tmp += v.length + 1;
                        let end = z;
                        let mentionz = `{"S":"0","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					mentionMemberx.push(mentionMember1);
				    //const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }}
				    //seq.contentMetadata = tag.cmddata;
				    //this._client.sendMessage(0, seq);
				}else{
				    let namanya = listMember[i].displayName;//.dn;
				    let midnya = listMember[i].mid;
					let kata = seq.text.split("");
					let panjang = kata.length;
				    seq.text += "@"+namanya+" ";
                    let member = [namanya];
        
                    let tmp = 0;
                    let mentionMember = member.map((v,k) => {
                        let z = tmp += v.length + 1;
                        let end = z + panjang;
                        let mentionz = `{"S":"${panjang}","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					mentionMemberx.push(mentionMember);
				}
			}
			const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMemberx}]}` }}
			seq.contentMetadata = tag.cmddata;
			this._client.sendMessage(0, seq);
	}
	
	mension(listMember) {
        let mentionStrings = [''];
        let mid = [''];
        mentionStrings.push('@'+listMember.displayName+'\n');
        mid.push(listMember.mid);
        let strings = mentionStrings.join('');
        let member = strings.split('@').slice(1);
        
        let tmp = 0;
        let memberStart = [];
        let mentionMember = member.map((v,k) => {
            let z = tmp += v.length + 1;
            let end = z - 1;
            memberStart.push(end);
            let mentionz = `{"S":"${(isNaN(memberStart[k - 1] + 1) ? 0 : memberStart[k - 1] + 1 ) }","E":"${end}","M":"${mid[k + 1]}"}`;
            return mentionz;
        })
        return {
            names: mentionStrings.slice(1),
            cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }
        }
    }

    async recheck(cs,group) {
        let users;
        for (var i = 0; i < cs.length; i++) {
            if(cs[i].group == group) {
                users = cs[i].users;
            }
        }
        
        let contactMember = await this._getContacts(users);
        return contactMember.map((z) => {
                return { displayName: z.displayName, mid: z.mid };
            });
    }
	
	async leftGroupByName(payload) {
        let groupID = await this._getGroupsJoined();
	    for(var i = 0; i < groupID.length; i++){
		    let groups = await this._getGroups(groupID);
            for(var ix = 0; ix < groups.length; ix++){
                if(groups[ix].name == payload){
                    this._client.leaveGroup(0,groups[ix].id);
				    break;
                }
            }
	    }
    }

    removeReaderByGroup(groupID) {
        const groupIndex = this.checkReader.findIndex(v => {
            if(v.group == groupID) {
                return v
            }
        })

        if(groupIndex != -1) {
            this.checkReader.splice(groupIndex,1);
        }
    }

    //async textMessage(textMessages, seq, param) {
        //const [ cmd, payload ] = textMessages.split(' ');
    async textMessage(textMessages, seq, param, lockt) {
        let [ cmd, ...payload ] = textMessages.split(' ');
        payload = payload.join(' ');
        let txt = textMessages.toLowerCase();
        let messageID = seq.id;    
        //const txt = textMessages.toLowerCase();
        //const messageID = seq.id;
		const cot = textMessages.split('@');
		const com = textMessages.split(':');
		const cox = textMessages.split(' ');
		
        if(txt == "ag:clean" && isAdminOrBot(seq.from)){
            this._client.removeAllMessages();
            this._sendMessage(seq,"Done.");
        }
		
		if(vx[1] == "ag:ban" && seq.from == vx[0] && waitMsg == "yes"){
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(txt == "me"){
				if(isBanned(banList,seq.from)){
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					this._sendMessage(seq,"sudah masuk daftar banlist...");
				}else{
				    this._sendMessage(seq,"Sudah bosku !");
			        banList.push(seq.from);
				    waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				}
			}else{
				if(cot[1]){
					let ment = seq.contentMetadata.MENTION;
			        let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
					if(isBanned(banList,pment)){
						waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					    this._sendMessage(seq,cot[1]+" sudah masuk daftar banlist...");
				    }else{
					    this._sendMessage(seq,"Sudah bosku !");
			            banList.push(pment);
					    waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					}
				}else{
					this._sendMessage(seq,"Tag orangnya...");
				}
			}
		}
		if(txt == "ag:ban" && isAdminOrBot(seq.from)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from;vx[1] = txt;
			    this._sendMessage(seq,"Ban siapa ?");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == "ag:ban" && !isAdminOrBot(seq.from)){this._sendMessage(seq,"Not permitted !");}
		
		if(vx[1] == "ag:unban" && seq.from == vx[0] && waitMsg == "yes"){
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else{
				if(isBanned(banList, txt)){
					let ment = banList.indexOf(txt);
					if (ment > -1) {
                        banList.splice(ment, 1);
                    }
					waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
					this._sendMessage(seq,"Sudah bosku !");
				}else{
					this._sendMessage(seq,"Dia tidak masuk daftar banlist...");
				}
			}
		}
		if(txt == "ag:unban" && isAdminOrBot(seq.from)){
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from;vx[1] = txt;
				seq.text = "";
				for(var i = 0; i < banList.length; i++){
					let orangnya = await this._getContacts([banList[i]]);
				    seq.text += "\n-["+orangnya[0].mid+"]["+orangnya[0].displayName+"]";
				}
				this._sendMessage(seq,seq.text);
			    this._sendMessage(seq,"unban siapa ?");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		}else if(txt == "ag:unban" && !isAdminOrBot(seq.from)){this._sendMessage(seq,"Not permitted !");}
		
		if(txt == "ag:banlist" && isAdminOrBot(seq.from)) {
			seq.text = "[Ag~Bot List Users Banned]\n";
			for(var i = 0; i < banList.length; i++){
			    let orangnya = await this._getContacts([banList[i]]);
				seq.text += "\n? ["+orangnya[0].mid+"]["+orangnya[0].displayName+"]";
			}
			this._sendMessage(seq,seq.text);
		}
		
		if(txt == "ag:bye" && isAdminOrBot(seq.from)){
			this._client.leaveGroup(0,seq.to);
		}
		
		
		if(txt == "ag:mute" && isAdminOrBot(seq.from)){
			this.stateStatus.mute = 1;
			this._sendMessage(seq,"(*´??*)")
		}
		
       if(txt == "ag:mute" || txt == "ag:unmute"){
            if(isAdmin(seq.from))
            {
            }
            else if(isBot(seq.from))
            {
            }
          else
            {
            this._sendMessage(seq,"Mohon Maaf Anda Bukan Admin (?????)??");
             }

      }

        if(txt == 'ag:cancel' && this.stateStatus.cancel == 1 && isAdminOrBot(seq.from)) {
            this.cancelAll(seq.to);
        }

        if(txt == 'halo') {
			let { mid, displayName } = await this._client.getProfile();
            this._sendMessage(seq, 'Halo juga, disini dengan '+displayName);
        }
		

        if(txt == 'ag:speed' && isAdminOrBot(seq.from)) {
            const curTime = (Date.now() / 1000);
            await this._sendMessage(seq,'Please Waiting...');
            const rtime = (Date.now() / 1000) - curTime;
            await this._sendMessage(seq, `${rtime} second`);
        }

        /*if(txt === 'kernel') {
            exec('uname -a;ptime;id;whoami',(err, sto) => {
                this._sendMessage(seq, sto);
            })
        }*/

        //if(txt === 'ag:kickall' && this.stateStatus.kick == 1 && isAdminOrBot(seq.from) && seq.toType == 2) {
        if(txt === 'ag:kickall' && this.stateStatus.kick == 1 && isAdminOrBot(seq.from)) {
            let { listMember } = await this.searchGroup(seq.to);
            for (var i = 0; i < listMember.length; i++) {
                if(!isAdminOrBot(listMember[i].mid)){
                    this._kickMember(seq.to,[listMember[i].mid])
                }
            }
        }        
        // }else if(txt === 'ag:kickall' && !isAdminOrBot(seq.from) && seq.toType == 2){this._sendMessage(seq,"Not permitted !");} //JANGAN DIUBAH KENTOD
		

		if(txt == 'ag:help' && isAdminOrBot(seq.from)) {
			seq.text = this.helpagler;
			this._client.sendMessage(0, seq);
		}
		

		if(cox[0] == "ag:broadcast" && isAdminOrBot(seq.from) && cox[1]){
            let listMID = [];
            let bcText = textMessages.split(" ").slice(1).toString().replace(/,/g , " ");
            let bcm = new Message();
            bcm.toType = 0;
	        let listGroups = await this._client.getGroupIdsJoined();listMID.push(listGroups);
			for(var i = 0; i < listMID.length; i++){
		        for(var xi = 0; xi <listMID[i].length; xi++){
		        	bcm.to = listMID[i][xi];
                    let midc = listMID[i][xi].split("");
                    if(midc[0] == "u"){bcm.toType = 0;}else if(midc[0] == "c"){bcm.toType = 2;}else if(midc[0] == "r"){bcm.toType = 1;}else{bcm.toType = 0;}
                    bcm.text = bcText;
                    this._client.sendMessage(0, bcm);
	        	}
            }
        }else if(cox[0] == "ag:broadcast" && isAdminOrBot(seq.from) &&!cox[1]){this._sendMessage(seq,"# How to broadcast:\nbroadcast yourtexthere");
        }

        if(cox[0] == "ag:broadcast") {
            if(isAdmin(seq.from))
            {
            }
            else if(isBot(seq.from))
            {
            }
          else
            {
              this._sendMessage(seq,"Mohon Maaf Anda Bukan Admin~");
             }

      }
		
		if(txt == '0101') {//Jangan dicoba (gk ada efek)
            let { listMember } = await this.searchGroup(seq.to);
            for (var i = 0; i < listMember.length; i++) {
                if(listMember[i].mid==param){
					let namanya = listMember[i].displayName;//.dn;
					seq.text = 'Halo @'+namanya+', Selamat datang di group, semoga betah ^_^';
					let midnya = listMember[i].mid;
					let kata = seq.text.split("@").slice(0,1);
					let kata2 = kata[0].split("");
					let panjang = kata2.length;
                    let member = [namanya];
        
                    let tmp = 0;
                    let mentionMember = member.map((v,k) => {
                        let z = tmp += v.length + 1;
                        let end = z + panjang;
                        let mentionz = `{"S":"${panjang}","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }}
					seq.contentMetadata = tag.cmddata;
					this._client.sendMessage(0, seq);
					//console.info("Salam");
                }
            }
        }
		
		if(txt == '0102') {//Jangan dicoba (gk ada efek)
            let { listMember } = await this.searchGroup(seq.to);
            for (var i = 0; i < listMember.length; i++) {
                if(listMember[i].mid==param){
					let namanya = listMember[i].displayName;//.dn;
					seq.text = 'Goodbye ! @'+namanya;
					let midnya = listMember[i].mid;
					let kata = seq.text.split("@").slice(0,1);
					let kata2 = kata[0].split("");
					let panjang = kata2.length;
                    let member = [namanya];
        
                    let tmp = 0;
                    let mentionMember = member.map((v,k) => {
                        let z = tmp += v.length + 1;
                        let end = z + panjang;
                        let mentionz = `{"S":"${panjang}","E":"${end}","M":"${midnya}"}`;
                        return mentionz;
                    })
					const tag = {cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }}
					seq.contentMetadata = tag.cmddata;
					this._client.sendMesgsage(0, seq);
					//console.info("Sambut");
                }
            }
        }

        if(txt == 'ag:setpoint' && isAdminOrBot(seq.from)) {
            this._sendMessage(seq, `Setpoint for check reader.`);
            this.removeReaderByGroup(seq.to);
        }

        if(txt == 'ag:clear' && isAdminOrBot(seq.from)) {
            this.checkReader = []
            this._sendMessage(seq, `Remove all check reader on memory`);
        }  

        if(txt == 'ag:recheck' && isAdminOrBot(seq.from)) {
            let rec = await this.recheck(this.checkReader,seq.to);
            const mentions = await this.mention(rec);
            seq.contentMetadata = mentions.cmddata;
            await this._sendMessage(seq,mentions.names.join(''));
            
        }

        if(txt == 'setpoint for check reader .') {
            this.searchReader(seq);
        }

        if(txt == 'ag:clearall' && isAdminOrBot(seq.from)) {
            this.checkReader = [];
        }

         if(txt == 'ag:status') {
            this._sendMessage(seq,`Status: \n${JSON.stringify(this.stateStatus)}\n\n-Team Noob Bot-`);
          }

		if(txt == "ag:setting"){
			this.setState(seq,1)
		}        

        const action = ['cancel on','cancel off','kick on','kick off','sambut on','sambut off','autoread on','autoread off','autorespon on','autorespon off']
        if(action.includes(txt)) {
            this.setState(seq)
        }
	
        // if(txt == 'myid' /*|| txt == 'mid' || txt == 'id'*/) {
            // this._sendMessage(seq,"MID Anda : "+seq.from);
        // }
        
         if(txt == 'ag:myid' && isAdminOrBot(seq.from)) {
            this._sendMessage(seq,`MID Anda : ${seq.from}`);
        }   

        if(txt == 'ag:tag' && isAdminOrBot(seq.from)) {
let { listMember } = await this.searchGroup(seq.to);
     const mentions = await this.mention(listMember);
        seq.contentMetadata = mentions.cmddata; await this._sendMessage(seq,mentions.names.join(''))
        }    
       
        
        /*if(cmd == 'ag:spam' && isAdminOrBot(seq.from)) {
            for(var i= 0; i < 10;  i++) {
               this._sendMessage(seq, 'Agler memang ganteng (?????)??');
        }
    }*/

        //if(cmd == 'join') {
            //const [ ticketId ] = payload.split('g/').splice(-1);
            //let { id } = await this._findGroupByTicket(ticketId);
            //await this._acceptGroupInvitationByTicket(id,ticketId);
        //}

        //if(cmd === 'ip') {
            //exec(`curl ipinfo.io/${payload}`,(err, res) => {
                //const result = JSON.parse(res);
                //if(typeof result.error == 'undefined') {
                    //const { org, country, loc, city, region } = result;
                    //try {
                        //const [latitude, longitude ] = loc.split(',');
                        //let location = new Location();
                        //Object.assign(location,{ 
                            //title: `Location:`,
                            //address: `${org} ${city} [ ${region} ]\n${payload}`,
                            //latitude: latitude,
                            //longitude: longitude,
                            //phone: null 
                        //})
                        //const Obj = { 
                            //text: 'Location',
                            //location : location,
                            //contentType: 0,
                        //}
                        //Object.assign(seq,Obj)
                        //this._sendMessage(seq,'Location');
                    //} catch (err) {
                        //this._sendMessage(seq,'Not Found');
                    //}
                //} else {
                    //this._sendMessage(seq,'Location Not Found , Maybe di dalem goa');
                //}
            //})
        //}*/
    }

}

module.exports = new LINE();