

$('#loginForm').on('submit', function(e){

    e.preventDefault()

    $.ajax({
        url: $(this).attr('action'),
        type: 'POST',
        data: $(this).serialize(),
        success: function() {
            window.location.href = '/space/dashboard'
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    })

})

$('.maintanance-switch').on('change', function() {
    
    $.ajax({
        url: '/space/settings/maintanence',
        type: 'POST',
        data: $(this).serialize(),
        success: function(response) {
            $('.maintanence-label').text(response)
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    })

})

$('.mail-switch').on('change', function() {
    
    $.ajax({
        url: '/space/settings/mails',
        type: 'POST',
        data: $(this).serialize(),
        success: function(response) {
            $('.mail-label').text(response)
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    })

})