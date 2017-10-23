$(function () {
  var $upvote = $('.up')
  var $downvote = $('.down')
  var $votes = $('.votes')
  var dbURL = 'mongodb://localhost/askiez'

  $upvote.on('click', function (e) {
    e.preventDefault()
    var id = $(this).parents('a').attr('href').replace('/thread/', '')
    var $voteCount = $(this).parents('.columns').find('.votes')
    var votes = $voteCount.text()
    votes++
    $voteCount.text(votes)

    $.ajax({
      type: 'POST',
      url: '/',
      data: { "upvotes": 1, "id": id }
    })
    .done(res => {
      console.log('POST request sent')
    })
    .fail(() => {
      console.log('POST request failed')
    })
  })

  $downvote.on('click', function (e) {
    e.preventDefault()
    var id = $(this).parents('a').attr('href').replace('/thread/', '')
    var $voteCount = $(this).parents('.columns').find($('.votes'))
    var votes = $voteCount.text()
    votes--
    $voteCount.text(votes)
    
    $.ajax({
      type: 'POST',
      url: '/',
      data: { "downvotes": 1, "id": id }
    })
    .done(res => {
      console.log('POST request sent')
    })
    .fail(() => {
      console.log('POST request failed')
    })
  })
})
