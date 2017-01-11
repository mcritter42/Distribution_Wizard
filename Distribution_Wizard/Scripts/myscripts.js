// Mark Ritter
$(function () {

    var checkboxes = $('input[name="salesmen_terminated"]'),
    submitButt = $("#reassure_button");

    checkboxes.click(function () {
        submitButt.attr("disabled", !checkboxes.is(":checked"));
    });

        //setting and styling the dialog boxes for main window & reassurance window
        $("#dialog").dialog({
            autoOpen: true,
            resizable: false,
            height: 500,
            width: 400,
            draggable: false,
            modal: true,
            show: {
                effect: "fade",
                duration: 1000
            },
            hide: {
                effect: "fade",
                duration: 1000
            }
        });

        $("#reassureDialog").dialog({
            autoOpen: false,
            resizable: false,
            height: 300,
            width: 350,
            draggable: false,
            modal: true,
            show: {
                effect: "fade",
                duration: 1000
            },
            hide: {
                effect: "fade",
                duration: 1000
            }
        });

        //determining when dialog boxes will opened & closed
        $("#start_button").click(function () {
            $("#dialog").dialog("open");
            $("#reassureDialog").dialog("close");
            url: "/index/after_termination_employee_table"
        });

        $("#exit_button").click(function () {
            $("#reassureDialog").dialog("close");
        });

        $("#reassure_button").click(function () {
            $('input[name="salesmen_terminated"]:checked').each(function () {
                var value = this.value;
                var split = value.split("/");
                var terminated_name = split[0];
                var terminated_ID = split[1];
                document.getElementById("Terminated_employee_name").setAttribute("value", terminated_name);
                document.getElementById("Terminated_employee_id").setAttribute("value", terminated_ID);

            });
            $("#reassureDialog").dialog("open");
        });


        var jsonObj = [];
        $("#btn_submit").click(function () {
            $('input[name="Percentages"]').each(function () {
                var value = this.value;
                var id = this.id;

                jsonObj.push({
                    ID: id,
                    percent: value
                });
            });
            var json = JSON.stringify(jsonObj)

            var T_emp_id = document.getElementById("terminated_id_hid").value;
            var T_clients = document.getElementById("total_clients_value").value;
            document.getElementById("json").setAttribute("value", json);
            document.getElementById("total_clients").setAttribute("value", T_clients);
            document.getElementById("terminated_id").setAttribute("value", T_emp_id);


        });
        $("#no_btn").click(function () {
            $("#reassureDialog").dialog("close");
        });

    });


    //styling the progress bars
    $('#salespersonProgBar').width(300);

    $("#salespersonProgBar").css('background', '#00000000');

    //Disable submit button on start up
    submitUpdate(inputTotal);

    //jquery functions for the progress bars
    //Goal - dynamically update progress bars based on input number - completed (I think)

    //reads what is in the text box, calls the calculateTotal, which then adds up the total
    $(".percentBox").each(function () {
        $(this).keyup(function () {
            calculateTotal(inputTotal);
        });
    });

    //function adds up the total amount from what has been inputed, needs to set max value
    var inputTotal = 0;

    function calculateTotal(inputTotal) {
        var inputTotal = 0;

        //reads what is in the percentBox and adds it to the inputTotal variable
        $(".percentBox").each(function () {
            if (!isNaN(this.value) && this.value.length == 2 || this.value.length != 0) {
                inputTotal += parseFloat(this.value);
                salespersonUpdateBar(inputTotal);
                percentUpdate(inputTotal);
                submitUpdate(inputTotal);
            }
        });
    };

    //Displays the total percent as it is being entered into the percent boxes
    function percentUpdate(inputTotal) {
        document.getElementById("percentTotal").innerHTML = inputTotal
    };


    function salespersonUpdateBar(inputTotal) {
        console.log(inputTotal);
        $('#salespersonProgBar').val(inputTotal);
        //$('#salespersonProgBar').animate({ value: inputTotal }, 1000);
    };

    //Enable/disable submit button depending on percentages

    function submitUpdate(inputTotal) {
        if (inputTotal != 100) {
            document.getElementById("btn_submit").disabled = true;
            
        }
        else {
            document.getElementById("btn_submit").disabled = false;
           
        }
    }


    $("#salespersonProgBar").progressbar({
        value: 0
    });