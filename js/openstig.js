// var readAPI = 'http://localhost:8084'
// var scoreAPI = 'http://localhost:8090'
// var saveAPI = 'http://localhost:8082'
// var uploadAPI = 'http://localhost:8086'
// var templateAPI = 'http://localhost:8088'

var readAPI = 'http://openstigapi-read:8080'
var scoreAPI = 'http://openstigapi-scoring:8080'
var saveAPI = 'http://openstigapi-save:8080'
var uploadAPI = 'http://openstigapi-upload:8080'
var templateAPI = 'http://openstigapi-template:8080'

/*************************************
 * Dashboard functions
 ************************************/
// fill in the # of total checklists in the system on the dashboard page top right
async function getChecklistTotalCount() {
	let response = await fetch(readAPI + "/count");
	if (response.ok) {
			var data = await response.json()
			$("#numberChecklistsTotal").html(data);
			$("#numberNewChecklistsTotal").text(data);
	}
	else 
		throw new Error(response.status)
}

/*************************************
 * Template listing functions
 ************************************/
async function getTemplates(latest) {
	var url = templateAPI;	
	let response = await fetch(url);
	// parse the result regardless of the one called as the DIV are the same on Dashboard/index and the checklists pages
  if (response.ok) {
			var data = await response.json()
			var intNaF = 0;
			var intNA = 0;
			var intOpen = 0;
			var intNR = 0;
			// cycle through the data and fill in the data table at id tblChecklistListing div.html()
			var table = "";
			table += '<table class="table table-condensed table-hover table-bordered table-responsive-md"><thead><tr><th class="tabco1">Name</th>'
			table += '<th class="tabco2">Not a Finding</th><th class="tabco3">Not Applicable</th><th class="tabco4">Open</th><th class="tabco5">Not Reviewed</th>'
			table += '</tr></thead><tbody>'
			if (data.length == 0) {$("#tblChecklistListing").html("There are currently no STIG checklist templates uploaded. Go to the Upload page to add your first one.");}
			else {
					for (const item of data) {
					table += '<tr><td class="tabco1"><a href="single-template.html?id=' + item.id + '">'
					table += item.title
					intNaF = 0;
					intNA = 0;
					intOpen = 0;
					intNR = 0;
					// var score = await getScoreForChecklistListing(item.id);
					// if (score) {
					// 	intNaF = score.totalNotAFinding;
					// 	intNA = score.totalNotApplicable;
					// 	intOpen = score.totalOpen;
					// 	intNR = score.totalNotReviewed;
					// 	}
					table += '</a><br /><span class="small">last updated on '
					if (item.updatedOn) {
							table += moment(item.updatedOn).format('MM/DD/YYYY h:mm a');
					}
					else {
						table += moment(item.created).format('MM/DD/YYYY h:mm a');
					}
					table += '</span></td><td class="tabco2"><i class="fa" aria-hidden="true"></i>' + intNaF.toString() + '</td>'
					table += '<td class="tabco3"><i class="fa" aria-hidden="true"></i>' + intNA.toString() + '</td>'
					table += '<td class="tabco4"><i class="fa" aria-hidden="true"></i>' + intOpen.toString() + '</td>'
					table += '<td class="tabco5"><i class="fa" aria-hidden="true"></i>' + intNR.toString() + '</td>'
					table += '</tr>'
				}
			table += '</tbody></tbody></table>'
			// with all the data fill in the table and go
			$("#tblChecklistListing").html(table);
		}
	}
	else 
		throw new Error(response.status)
}
/*************************************
 * Checklist listing functions
 ************************************/
async function getChecklists(latest) {
	var url = readAPI;
	if (latest) // get the top 5
		url += "/latest/5";
	
	let response = await fetch(url);
	// parse the result regardless of the one called as the DIV are the same on Dashboard/index and the checklists pages
  if (response.ok) {
			var data = await response.json()
			var intNaF = 0;
			var intNA = 0;
			var intOpen = 0;
			var intNR = 0;
			// cycle through the data and fill in the data table at id tblChecklistListing div.html()
			var table = "";
			table += '<table class="table table-condensed table-hover table-bordered table-responsive-md"><thead><tr><th class="tabco1">Name</th>'
			table += '<th class="tabco2">Not a Finding</th><th class="tabco3">Not Applicable</th><th class="tabco4">Open</th><th class="tabco5">Not Reviewed</th>'
			table += '</tr></thead><tbody>'
			if (data.length == 0) {$("#tblChecklistListing").html("There are currently no STIG checklists uploaded. Go to the Upload page to add your first one.");}
			else {
					for (const item of data) {
					table += '<tr><td class="tabco1"><a href="single-checklist.html?id=' + item.id + '">'
					table += item.title
					intNaF = 0;
					intNA = 0;
					intOpen = 0;
					intNR = 0;
					var score = await getScoreForChecklistListing(item.id);
					if (score) {
						intNaF = score.totalNotAFinding;
						intNA = score.totalNotApplicable;
						intOpen = score.totalOpen;
						intNR = score.totalNotReviewed;
						}
					table += '</a><br /><span class="small">last updated on '
					if (item.updatedOn) {
							table += moment(item.updatedOn).format('MM/DD/YYYY h:mm a');
					}
					else {
						table += moment(item.created).format('MM/DD/YYYY h:mm a');
					}
					table += '</span></td><td class="tabco2"><i class="fa" aria-hidden="true"></i>' + intNaF.toString() + '</td>'
					table += '<td class="tabco3"><i class="fa" aria-hidden="true"></i>' + intNA.toString() + '</td>'
					table += '<td class="tabco4"><i class="fa" aria-hidden="true"></i>' + intOpen.toString() + '</td>'
					table += '<td class="tabco5"><i class="fa" aria-hidden="true"></i>' + intNR.toString() + '</td>'
					table += '</tr>'
				}
			table += '</tbody></tbody></table>'
			// with all the data fill in the table and go
			$("#tblChecklistListing").html(table);
		}
	}
	else 
		throw new Error(response.status)
}
// called from above to return the checklist score
async function getScoreForChecklistListing(id, template) {
	var url = scoreAPI;
	if (template)
		url = templateAPI;

	let responseScore = await fetch(scoreAPI + "/artifact/" + id);
	if (responseScore.ok) {
		var dataScore = await responseScore.json()
		return dataScore;
	}
}
/*************************************
 * Single Checklist Data functions
 *************************************/
// get the specific checklist data
async function getChecklistData(id, template) {
	var url = readAPI;
	if (template)
		url = templateAPI;
  let response = await fetch(url + "/" + id);
  if (response.ok) {
      var data = await response.json()
			$("#checklistTitle").html('<i class="fa fa-table"></i> ' + data.title);
			var updatedDate = "Last Updated on ";
			if (data.updatedOn) {
				updatedDate += moment(data.updatedOn).format('MM/DD/YYYY h:mm a');
			}
			else {
				updatedDate += moment(data.created).format('MM/DD/YYYY h:mm a');
			}
			$("#checklistDescription").html("Description: " + data.description);
			$("#checklistType").html("Type: " + data.typeTitle);

			$("#chartSeverityUpdated").html(updatedDate);
			$("#chartCategoryUpdated").html(updatedDate);
			$("#barChartUpdated").html(updatedDate);
			$("#checklistLastUpdated").html(updatedDate);
  }
  else 
    throw new Error(response.status)
}
// call to get the score data and show the name and then funnel data to the
async function getChecklistScore(id, template) {
	var data = await getScoreForChecklistListing(id, template);
	$("#checklistNotAFindingCount").text(data.totalNotAFinding.toString());
	$("#checklistNotApplicableCount").text(data.totalNotApplicable.toString());
	$("#checklistOpenCount").text(data.totalOpen.toString());
	$("#checklistNotReviewedCount").text(data.totalNotReviewed.toString());
	// show the charts with the same data
	makeChartSeverity(data);
	makeChartCategory(data);
	makeBarChartBreakdown(data);
}
// pie chart with the status of the checklist
async function makeChartSeverity (data) {
	var ctx3 = document.getElementById("chartSeverity").getContext('2d');
	var chartSeverity = new Chart(ctx3, {
		type: 'pie',
		data: {
				datasets: [{
					data: [data.totalOpen, data.totalNotAFinding, data.totalNotApplicable, data.totalNotReviewed],
					backgroundColor: [
						'rgba(255,99,132,1)',
						'rgba(75, 192, 192, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(150, 150, 150, 1)'
					],
					label: 'Checklist Severity Breakdown'
				}],
				labels: [
					"Open",
					"Not a Finding",
					"Not Applicable",
					"Not Reviewed"
				]
			},
			options: {
				responsive: true
			}
	 
  });
}
function downloadChart(element) {
	var img = document.getElementById(element).toDataURL("image/jpg");
	//location.href = url;
	var element = document.createElement('a');
	element.setAttribute('href', img);
	element.setAttribute('download', "openSTIGChart.jpg");
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}
// pie chart showing breakdown by category 1/2/3
async function makeChartCategory (data) {
	var ctx4 = document.getElementById("chartCategory").getContext('2d');
	var chartCategory = new Chart(ctx4, {
		type: 'pie',
		data: {
				datasets: [{
					data: [data.totalCat1, data.totalCat2, data.totalCat3],
					backgroundColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)'
					],
					label: 'Category Breakdown'
				}],
				labels: [
					"CAT I",
					"CAT II",
					"CAT III"
				]
			},
			options: {
				responsive: true
			}
  });
}
// bar chart breaking down score by category and status
async function makeBarChartBreakdown(data) {  
	// barChart
	var ctx1 = document.getElementById("barChart").getContext('2d');
	var barChart = new Chart(ctx1, {
		type: 'bar',
		data: {
			labels: ["CAT I - Open", "CAT I - Not a Finding", "CAT I - N/A", "CAT I - Not Reviewed", "CAT II - Open", "CAT II - Not a Finding", "CAT II - N/A", "CAT II - Not Reviewed","CAT III - Open", "CAT III - Not a Finding", "CAT III - N/A", "CAT III - Not Reviewed"],
			datasets: [{
				label: '# Vulnerabilities by Status and Category',
        data: [data.totalCat1Open, data.totalCat1NotAFinding, data.totalCat1NotApplicable, data.totalCat1NotReviewed, 
          data.totalCat2Open, data.totalCat2NotAFinding, data.totalCat2NotApplicable, data.totalCat2NotReviewed, 
          data.totalCat3Open, data.totalCat3NotAFinding, data.totalCat3NotApplicable, data.totalCat3NotReviewed],
				backgroundColor: [
					'rgba(255, 99, 132, 0.5)',
					'rgba(75, 192, 192, 0.5)',
					'rgba(54, 162, 235, 0.5)',
					'rgba(150, 150, 150, 0.5)',	
					'rgba(255, 99, 132, 0.5)',
					'rgba(75, 192, 192, 0.5)',
					'rgba(54, 162, 235, 0.5)',
					'rgba(150, 150, 150, 0.5)',	
					'rgba(255, 99, 132, 0.5)',
					'rgba(75, 192, 192, 0.5)',
					'rgba(54, 162, 235, 0.5)',
					'rgba(150, 150, 150, 0.5)'	
				],
				borderColor: [
					'rgba(0,0,0,0.7)',
					'rgba(0,0,0,0.7)',
					'rgba(0,0,0,0.7)',
					'rgba(0,0,0,0.7)',
					'rgba(0,0,0,0.7)',
					'rgba(0,0,0,0.7)',
					'rgba(0,0,0,0.7)',
					'rgba(0,0,0,0.7)',
					'rgba(0,0,0,0.7)',
					'rgba(0,0,0,0.7)',
					'rgba(0,0,0,0.7)',
					'rgba(0,0,0,0.7)'
				],
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
		}
	});
}

// download the XML into a .CKL file to use
async function downloadChecklistFile(id, template){
	var url = readAPI;
	if (template)
		url = templateAPI;

	let response = await fetch(url + "/download/" + id);
	if (response.ok) {
		var data = await response.text();
		var element = document.createElement('a');
		element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(data));
		element.setAttribute('download', "openSTIG.ckl");
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
}
/************************************ 
 Upload Functions
************************************/
function uploadChecklist(){
	var formData = new FormData();
	formData.append("checklistType",$("#checklistType").val());
	formData.append("title",$("#checklistTitle").val());
	formData.append("description",$("#checklistDescription").val());
	formData.append('checklistFile',$('#checklistFile')[0].files[0]);
	$.ajax({
			url : uploadAPI,
			data : formData,
			type : 'POST',
			processData: false,
			contentType: false,
			success : function(data){
				swal("Your Checklist was uploaded successfully!", "Click OK to continue!", "success");
				// reset the form
				$("#frmChecklistUpload")[0].reset();
			}
	});
	return false;
}

function uploadTemplate(){
	var formData = new FormData();
	formData.append("checklistType",$("#templateType").val());
	formData.append("title",$("#templateTitle").val());
	formData.append("description",$("#templateDescription").val());
	formData.append('checklistFile',$('#templateFile')[0].files[0]);
	$.ajax({
			url : templateAPI,
			data : formData,
			type : 'POST',
			processData: false,
			contentType: false,
			success : function(data){
				swal("Your Template was uploaded successfully!", "Click OK to continue!", "success");
				// reset the form
				$("#frmTemplateUpload")[0].reset();
			}
	});
	return false;
}

/************************************
 * Reports Functions
 ***********************************/
// export with myLineChart.toBase64Image();
async function getChecklistTypeBreakdown() {
  let response = await fetch(readAPI + "/counttype");
  if (response.ok) {
			var data = await response.json()
			var ctx3 = document.getElementById("chartChecklistTypeBreakdown").getContext('2d');
			var chartSeverity = new Chart(ctx3, {
				type: 'pie',
				data: {
						datasets: [{
							label: 'Checklists by Type'
						}]
					},
					options: {
						responsive: true
					}
		});
		// cycle through the real data
		var myData = [];
		var myLabels = [];
		var myBGColor = [];
		if (data.length > 0){
			for (const item of data) {
				myData.push(item.count);
				myLabels.push(item.typeTitle);
				myBGColor.push(getRandomColor());
			}
		}
		else {
			myData.push(0);
			myLabels.push("None");
			myBGColor.push(getRandomColor());
		}
		chartSeverity.data.datasets[0].data = myData;
		chartSeverity.data.labels = myLabels;
		chartSeverity.data.datasets[0].backgroundColor = myBGColor;
		chartSeverity.update();
	}
}

/************************************ 
 Generic Functions
************************************/
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function getRandomColor() {
  var color = 'rgba(';
  color += (Math.floor(Math.random() * (255 - 0 + 1)) + 0).toString();
	color += ",";
  color += (Math.floor(Math.random() * (255 - 0 + 1)) + 0).toString();
	color += ",";
  color += (Math.floor(Math.random() * (255 - 0 + 1)) + 0).toString();
	color +=", 0.7)";
  return color;
}