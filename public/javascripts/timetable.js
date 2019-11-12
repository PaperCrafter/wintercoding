$('.card-lecture').click(function () {
  var card = $(this);
  var id = card.find('.lecture-id').val()
  $.ajax({
    url :'/items/'+id,
    method:'get',
    success: function(res) {
      $('#modal-lecture-info .lecture-id').val(res.id);
      $('#modal-lecture-info .lecture-title').text(res.lecture);
      //시간 텍스트 조정
      if(res.start_time <10)res.start_time = '0'+res.start_time;
      if(res.end_time < 10)res.end_time = '0'+res.end_time;

      if( res.dayofweek2 == '\r'|| res.dayofweek2 == null){
        $('#modal-lecture-info .lecture-time span').text("강의 시간 : " + res.start_time+":00 - " + res.end_time+ ":00 "+"("+ res.dayofweek1+")");
      }
      else{
        $('#modal-lecture-info .lecture-time span').text("강의 시간 : " + res.start_time+":00 - " + res.end_time+ ":00 "+"("+ res.dayofweek1+") "+"("+ res.dayofweek2+")");
      }

      $('#modal-lecture-info .lecture-code').children('span').each(function(index, item){
        if(index == 0 )$(this).text('교과목 코드 : '+ res.code);
        else if(index == 1 )$(this).text('담당 교수 : '+ res.professor);
        else if(index == 2 )$(this).text('강의실 : ' + res.location);
      });
      //add discription if possible

    }
  }, 'json');
  $('#modal-lecture-info').modal('show');
});

//과제 내용 보이기
$.on_toggle = function () {
  $('[data-toggle="tooltip"]').tooltip();
};


//메모 등록 보이기
$(function () {
  $('[data-toggle="popover"]').popover({
    container: 'body',
    html: true,
    placement: 'right',
    sanitize: false,
    content: function () {
      return $("#PopoverContent").html();
    }
  });
});


//과목 등록하기
$('#modal-lecture-info .btn-primary').click(function () {
  //0 기본정보 받아오기
  var lecture_info = $('#modal-lecture-info');
  var lecture_id = $('#modal-lecture-info').find('.lecture-id').val();
  console.log(lecture_id)
  var lecture_code = lecture_info.find('.lecture-code').children('span').first().text().substr(9,9);
  var lecture_time = lecture_info.find('.lecture-time').children('span').first().text();
  var lecture_time_start = lecture_time.substr(8,2);
  if(lecture_time_start.substr(0,1) === '0')lecture_time_start = lecture_time_start.substr(1,1);
  var lecture_time_end = lecture_time.substr(16,2);
  if(lecture_time_end.substr(0,1) === '0')lecture_time_end = lecture_time_end.substr(1,1);
  var lecture_time_day1 = lecture_time.substr(23,1);
  var lecture_time_day2 =  null;
  if(lecture_time.length > 26) lecture_time_day2 = lecture_time.substr(27,1);

  //1 시간 중복 확인 - ajax
  var can_append = false;
  $.ajax({
    url :'/items/check-duplicated',
    data: {
      'code':lecture_code,
      'start_time':lecture_time_start,
      'end_time':lecture_time_end,
      'dayofweek1':lecture_time_day1,
      'dayofweek2':lecture_time_day2
    },
    method:'post',
    async:false,
    success: function(res) {
      //만약 추가할 수 있으면
      console.log(res);
      if(res.status == true){
        can_append = true
      }
      //추가할 수 없으면
      else{
        can_append = false
      }
      //add discription if possible
    }
  }, 'json');
  //isAdded를 1로 만들어서 추가됨을 알림
  if(can_append === true){
    var id = lecture_id;
    $.ajax({
      url :'/items/' + id + '/register',
      type:'patch',
      async:false,
      success: function(res) {
        window.location = '/';
      }
    }, 'json');
  }else{
    alert('추가할 수 없습니다.');
  }
});


//동적으로 시간표에 추가된 항목 표시
$(function () {
  $.ajax({
    url :'/items/with/memos',
    method:'get',
    success: function(items) {
      var list_lecture_item = $('.list-lecture-item li ul');
      console.log(list_lecture_item);
      var list_lecture_mon = list_lecture_item.eq(0);
      var list_lecture_tue = list_lecture_item.eq(1);
      var list_lecture_wed = list_lecture_item.eq(2);
      var list_lecture_thr = list_lecture_item.eq(3);
      var list_lecture_fri = list_lecture_item.eq(4);
      var counter = 1;
      //선택된 항목들에 한해 추가
      items.map((item, index)=>{
        if(index==0||items[index-1].lecture != items[index].lecture){
          //console.log(item);
          var list_element = document.createElement('li');
          list_element.classList.add('lecture-time');
          //시간 설정
          if(item.end_time - item.start_time == 2){
            list_element.classList.add('two-hr');
          }
          //시간표 시작 위치 설정
          list_element.classList.add('hr-'+item.start_time);
          //시간표 색상정하는 attribute 설정
          if(counter < 10)list_element.setAttribute('data-event', 'lecture-0' + counter);
          else list_element.setAttribute('data-event', 'lecture-' + counter);
          counter++;

          var tagA = document.createElement('a');
          tagA.setAttribute('href', '#');

          var div = document.createElement('div');
          div.className = 'lecture-info';

          var lecture_id = document.createElement('input');
          lecture_id.className='lecture-id';
          lecture_id.setAttribute('type', 'hidden');
          lecture_id.setAttribute('value', item.id);
          div.appendChild(lecture_id);

          var lecture_title = document.createElement('h6');
          lecture_title.className = 'lecture-title';
          lecture_title.textContent =item.lecture;
          div.appendChild(lecture_title);
        
          var lecture_location = document.createElement('h6');
          lecture_location.className = 'lecture-location';
          lecture_location.textContent = item.location;
          div.appendChild(lecture_location);
          
          tagA.appendChild(div);
          list_element.appendChild(tagA);


          //시간표에 추가
          var day = item.dayofweek1;
          for(var i = 0; i < 2; i++){
            if(i === 1){
              if(item.dayofweek2 == '\r'|| item.dayofweek2 == null) break;
              list_element = list_element.cloneNode(true);
              day = item.dayofweek2;
            }
            //요일
            if(day === '월'){list_lecture_mon.append(list_element);}
            else if(day === '화'){list_lecture_tue.append(list_element);}
            else if(day === '수'){list_lecture_wed.append(list_element);}
            else if(day === '목'){list_lecture_thr.append(list_element);}
            else if(day === '금'){list_lecture_fri.append(list_element);}
          } 
        }
        //메모기능 추가
        if(item["Memos.title"] != null){
          var memo_location = $('hr-'+item.start_time).find('a');
          var memo_to_append = document.createElement('div');
          memo_to_append.className='lecture-noti';
          memo_to_append.setAttribute('data-toggle', 'tooltip');
          memo_to_append.setAttribute('data-placement', 'top');
          memo_to_append.setAttribute('title', item["Memos.discription"]);
          memo_to_append.setAttribute('data-original-title', item["Memos.discription"]);

          var memo_icon = document.createElement('i');
          memo_icon.classList.add('material-icons');
          memo_icon.classList.add('ic-lecture-noti');
          memo_icon.textContent = 'assignment';

          var memo_text = document.createElement('span');
          memo_text.className='lecture-noti-title';
          memo_text.textContent= item["Memos.title"];

          memo_to_append.appendChild(memo_icon);
          memo_to_append.appendChild(memo_text);

          //memo_location.append(memo_to_append);
          console.log(memo_to_append);

          //요일에 맞는 시간표 항목에 메모 추가
          var day = item.dayofweek1;
          for(var i = 0; i < 2; i++){
            if(i === 1){
              if(item.dayofweek2 == '\r'|| item.dayofweek2 == null) break;
              memo_to_append = memo_to_append.cloneNode(true);
              day = item.dayofweek2;
            }
            //요일
            if(day === '월'){list_lecture_mon.find('.hr-'+item.start_time).children('a').append(memo_to_append);
            console.log(list_lecture_mon.find('.hr-'+item.start_time))
            console.log(list_lecture_mon.find('.hr-9'))
            console.log(list_lecture_mon)}
            else if(day === '화'){list_lecture_tue.find('.hr-'+item.start_time).children('a').append(memo_to_append);}
            else if(day === '수'){list_lecture_wed.find('.hr-'+item.start_time).children('a').append(memo_to_append);}
            else if(day === '목'){list_lecture_thr.find('.hr-'+item.start_time).children('a').append(memo_to_append);}
            else if(day === '금'){list_lecture_fri.find('.hr-'+item.start_time).children('a').append(memo_to_append);}
          }
        }
        $.on_toggle();
      })
    }
  }, 'json');
});

//클릭 시 동적으로 추가된 모달(강의 테이블에 위치) 띄우기
$(document).on('click','.lecture-time > a', function () {
  var id = $(this).find('.lecture-id').val();

  $.ajax({
    url :'/items/'+id,
    method:'get',
    success: function(res) {
      $('#modal-lecture-task .lecture-id').val(res.id);
      $('#modal-lecture-task .lecture-title').text(res.lecture);
      //시간 텍스트 조정
      if(res.start_time <10)res.start_time = '0'+res.start_time;
      if(res.end_time < 10)res.end_time = '0'+res.end_time;

      if( res.dayofweek2 == '\r' || res.dayofweek2 == null){
        $('#modal-lecture-task .lecture-time span').text("강의 시간 : " + res.start_time+":00 - " + res.end_time+ ":00 "+"("+ res.dayofweek1+")");
      }
      else{
        $('#modal-lecture-task .lecture-time span').text("강의 시간 : " + res.start_time+":00 - " + res.end_time+ ":00 "+"("+ res.dayofweek1+") "+"("+ res.dayofweek2+")");
      }
      $('#modal-lecture-task .lecture-code').children('span').each(function(index, item){
        if(index == 0 )$(this).text('교과목 코드 : '+ res.code);
        else if(index == 1 )$(this).text('담당 교수 : '+ res.professor);
        else if(index == 2 )$(this).text('강의실 : ' + res.location);
      });
      $.get_memo();
      //add discription if possible
    }
  }, 'json');
  $.delete_memo();
  $('#modal-lecture-task').modal('show');
});

//제거버튼을 누르면 timetable에서 제거
$('#modal-lecture-task .btn-danger').click(function(){
  var id = $(this).parent().parent().parent().find('.lecture-info .lecture-id').val();
  $.ajax({
    url:'/items/'+id+'/unregister',
    method:'patch',
    success:function(){
      window.location = '/';
    }
  })
});

//메모 등록
$(document).on('click','.popover-body .btn-save', function () {
  console.log($(this).parent());
  console.log($('#PopoverContent #recipient-name'));
  console.log($('#PopoverContent #recipient-name').val());
  console.log($('.popover #recipient-name').val());
  console.log($('.popover #message-text').val());

  $.ajax({
    url:'/memos',
    method:'post',
    data:{
      lecture_id:$('#modal-lecture-task .lecture-id').val(),
      title: $('.popover #recipient-name').val(),
      discription: $('.popover #message-text').val()
    },
    success:function(res){
      $.get_memo();
      console.log(res);
    }
  })
})

//메모를 가져오는 함수
$.get_memo =  function () {
  var id = $('#modal-lecture-task .lecture-id').val();
  $.ajax({
    url :'/memos/' + id,
    method:'get',
    success: function(items) {
      //선택된 항목들에 한해 추가
      var memo=$('.lecture-memo');
      memo.children(ul).remove();
      //ul을 부수고 새로 로드
      var ul = document.createElement('ul');
      memo.append(ul);

      var memo_ul=$('.lecture-memo ul');
      items.map((item, index)=>{
        var memo_li = document.createElement('li');
        memo_li.className = 'memo-list'
        
        var memo_content = document.createElement('div');
        memo_content.className = 'memo-content';
        memo_content.setAttribute('data-toggle', 'tooltip');
        memo_content.setAttribute('data-placement', 'top');
        memo_content.setAttribute('title', item.discription);
        memo_content.setAttribute('data-original-title', item.discription);

        var memo_id = document.createElement('input');
        memo_id.className='memo-id';
        memo_id.setAttribute('type', 'hidden');
        memo_id.setAttribute('value', item.id);
        memo_content.append(memo_id);

        var memo_i1 = document.createElement('i');
        memo_i1.classList.add('material-icons');
        memo_i1.classList.add('ic-lecture-noti');
        memo_i1.textContent='assignment';
        memo_content.append(memo_i1);

        var memo_span = document.createElement('span');
        memo_span.classList.add('lecture-noti-title');
        memo_span.textContent = item.title;
        memo_content.append(memo_span);

        var memo_btn = document.createElement('div');
        memo_btn.className='memo-btn';

        var memo_a = document.createElement('a');
        memo_a.setAttribute('href', '#');

        var memo_i2 = document.createElement('i');
        memo_i2.classList.add('material-icons');
        memo_i2.classList.add('ic-lecture-noti');
        memo_i2.textContent='delete';
        memo_a.append(memo_i2);
        memo_btn.append(memo_a);
        //버튼에 두 가지 항목을 append
        memo_li.append(memo_content);
        memo_li.append(memo_btn);
        //ul에 항목을 하나씩 추가
        memo_ul.append(memo_li);
      })
      $.on_toggle();
      $.delete_memo();
    }
  }, 'json');
}

//메모 제거 함수
$.delete_memo = function () {
  $('.memo-btn a').on('click',function(){
    var id = $(this).parent().parent().find('.memo-id').val();
    console.log(id);
    $.ajax({
      url :'/memos/' + id,
      method:'delete',
      success:function(res){
        $.get_memo();
        console.log(res);
      }
    }, 'json')
  })
}
