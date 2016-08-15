$('#js-logout').click(function() {
        $.ajax({
            url: "/logout",
            method: "POST",
            success: function() {
                window.location.href = "/";
            },
            fail: function(qXHR, textStatus, errorThrown) {
                concole.log(arguments);
            }
        });
});
