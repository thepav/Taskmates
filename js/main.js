$(document).ready(function(){
  	var myFirebaseRef = new Firebase("https://taskmates.firebaseio.com/");
  	var nummates = 0;
  	var mateemails =[];
  	var tasknumref = {};



  	myFirebaseRef.child("mates").on("value", function(snapshot) {
  		var mates = snapshot.val();  // should be an array
  		 nummates = mates.length;
  		var add = '<tr><th> </th>';
  		for(i=0;i<mates.length;i++){
  			add = add+"<th class='matenames'id= '"+i+"''>"+mates[i].Name+'</th>';
  			mateemails.push(mates[i].Email);
  		}
  		add=add+"</tr><hr>";
  		$('#tasks').append(add);
  		// alert(mateemails);
	});


  	myFirebaseRef.child("Tasks").on("value", function(snapshot) {
  		$('.taskrow').remove();
  		var tasks = snapshot.val();  
  		for(i=0;i<tasks.length;i++){
  			tasknumref[tasks[i].Name] = i;
  			var task = tasks[i];
  			var mate = task.Mate;
  			console.log(mate);
  			var name = task.Name;
  			var add = "<tr class='taskrow'><td>"+name+'</td>';
  			for (j=0;j<nummates;j++){
  				if (mate == j){
  					add = add + "<td><a class='taskx' id='"+name+"-"+j+"'>X</a></td>"; // THE ID IS THE NAME-J
  				}else{
  					add = add+ '<td> </td>';
  				}
  			}
  			add = add+'</tr>';
  			$('#tasks').append(add);

  		}

  		function sendMail(address,task) {
		    var link = "mailto:"+mateemails[address].trim()
		             + "?subject=" + escape("TASKMATES ALERT")
		             + "&body=" + escape("Hey I just completed the '"+task+"' task. Your turn!");
		    window.location.href = link;
		}
		$(".taskx").click(function(event) {
			alert('yo');
			var id = event.target.id;
			var task = id.split('-')[0];
			var mate = id.split('-')[1];
			sendMail(mate,task);
			mate = Number(mate)+1;
			alert(mate);
			if (mate>=nummates){
				mate = 0;
			}
			myFirebaseRef.child('Tasks/'+tasknumref[task]+'').set({
					Name: task,
					Mate: mate
			});

		});

	});

	

	

});