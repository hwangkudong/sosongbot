/**
 * Created by http://myeonguni.com on 2016-09-04.
 */

module.exports = function(app, db, fs)
{	
	var txtMsg = {
			"message":{
				"text" : "서비스를 사용할 수 없습니다.\n 잠시 후 이용하시기 바랍니다."
			}
		};
	// 키보드
	app.get('/keyboard', function(req, res){
        fs.readFile( __dirname + "/../data/" + "keyboard.json", 'utf8', function (err, data) {
           console.log( data );
           res.end( data );
        });
    });
	
	//[윤준호] 메뉴선택 처리
	app.post('/message', function(req, res){
		var result = {  };
		
		// CHECK REQ VALIDITY
        if(!req.body["user_key"] || !req.body["type"] || !req.body["content"]){
            result["success"] = 0;
            result["error"] = "invalid request";
			res.json(result);
            return;
        }
        //스키마 객체화
        var Message = require('../models/message');
        //응답 중 'text'만 처리
        if(req.body["type"] === "text"){
        	//선택한 content명으로 DB에서 조회
        	Message.findOne({menu_nm: req.body["content"]}, function(error,message){
        		var statusCode = 200;
        		//error 처리
        		if (error){
        			console.error(error);
        			statusCode = 500;
        			txtMsg["message"] =
        			{
        				"text" : "서비스를 사용할 수 없습니다.\n 잠시 후 이용하시기 바랍니다."
        			};
        		}else if (!message){
        			console.error(error);
        			statusCode = 404;
        			txtMsg["message"] =
        			{
       					"text" : "처리할 수 없는 메뉴입니다."
        			};
        		}else{
        			console.log(message["content"]);
        			statusCode = 200;	
        			txtMsg["message"] =
        			{
        				"text" : message["content"]
        			};
        		}
        		return res.status(statusCode).json(txtMsg);
        	});
        	
       	}//if - text
    });
	
	// 친구추가
	app.post('/friend', function(req, res){
        var result = {  };
		
		// 요청 param 체크
        if(!req.body["user_key"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }
		
		// 파일 입출력
        fs.readFile( __dirname + "/../data/friend.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
			// 이미 존재하는 친구일 경우
            if(users[req.body["user_key"]]){
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }
            // 친구추가
            users[req.body["user_key"]] = req.body;
            fs.writeFile(__dirname + "/../data/friend.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = 200;
                res.json(result);
                return;
            })
        })
    });
	
	// 친구삭제(차단)
	app.delete('/friend/:user_key', function(req, res){
        var result = { };
		
        // 파일 입출력
        fs.readFile(__dirname + "/../data/friend.json", "utf8", function(err, data){
            var users = JSON.parse(data);
 
            // 존재하지 않는 친구일 경우
            if(!users[req.params.user_key]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }
			// 친구 삭제
            delete users[req.params.user_key];
            fs.writeFile(__dirname + "/../data/friend.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = 200;
                res.json(result);
                return;
            })
        })
    })
	
	// 채팅방 나가기
	app.delete('/chat_room/:user_key', function(req, res){
        var result = { };
		result = 200;
		res.json(result);
		return;
    })
}
