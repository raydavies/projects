$(document).ready(function() {
	$('#commentform').submit(function() {
		return verifyForm();
	});
});

function verifyForm()
{
	var comment = document.getElementById("comment");
	var cmmtmsg = document.getElementById("commenterrormsg");
	var cmmtvalid = false;

	if (emptyField(comment,cmmtmsg)) {
		return true;
	} else {
		return false;
	}
}

function emptyField(field,msg)
{
	if (field.value!='') {
		msg.style.display="none";
		return true;
	} else {
		msg.style.display="inline";
		return false;
	}
}
