

$('#loginForm').on('submit', function(e){

    e.preventDefault()

    $.ajax({
        url: $(this).attr('action'),
        type: 'POST',
        data: $(this).serialize(),
        success: function() {
            alert('asd')
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    })

})

$('.maintanance-switch').on('change', function() {
    
    $.ajax({
        url: '/admin/settings/maintanence',
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
        url: '/admin/settings/mails',
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