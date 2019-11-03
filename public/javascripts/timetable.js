$('.card-lecture').click(function () {
  var card = $(this);
  var lecture = card.find('.list-lecture-info').first().text();
  lecture_code = lecture.substr(9,9);
  $.ajax({
    url :'/items/get_modal_item',
    method:'get',
    data: {'lecture_code':lecture_code},
    success: function(res) {
      $('#modal-lecture-info .lecture-title').text(res.lecture);
      //시간 텍스트 조정
      if(res.start_time <10)res.start_time = '0'+res.start_time;
      if(res.end_time < 10)res.end_time = '0'+res.end_time;

      if( res.dayofweek2 == '\r'){
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
    url :'/items/chk_duplicated_item',
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
  console.log(can_append);
  //isAdded를 1로 만들어서 추가됨을 알림
  if(can_append === true){
    var data = {'code':lecture_code};
    console.log(data);
    $.ajax({
      url :'/items/add_timetable_item/'+lecture_code,
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
    url :'/items/get_table_item',
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
        console.log(item);
        var list_element = document.createElement('li');
        list_element.classList.add('lecture-time');
        //시간 설정
        if(item.end_time - item.start_time == 2){
          list_element.classList.add('two-hr');
        }

        list_element.classList.add('hr-'+item.start_time);
        counter = index+1;
        if(counter < 10)list_element.setAttribute('data-event', 'lecture-0' + counter);
        else list_element.setAttribute('data-event', 'lecture-' + counter);

        var tagA = document.createElement('a');
        tagA.setAttribute('href', '#');

        var div = document.createElement('div');
        div.className = '.lecture-info';

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
            if(item.dayofweek2 == '\r') break;
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
        
      })
    }
  }, 'json');
});

//클릭 시 동적으로 추가된 모달(강의 테이블에 위치) 띄우기
$(document).on('click','.lecture-time > a', function () {
  var lecture = $(this).find('.lecture-title').text();
  console.log(lecture);
  $.ajax({
    url :'/items/get_modal_item_name',
    data: {'lecture':lecture},
    success: function(res) {
      $('#modal-lecture-task .lecture-title').text(res.lecture);
      //시간 텍스트 조정
      if(res.start_time <10)res.start_time = '0'+res.start_time;
      if(res.end_time < 10)res.end_time = '0'+res.end_time;

      if( res.dayofweek2 == '\r'){
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
  $('#modal-lecture-task').modal('show');
});

//제거버튼을 누르면 timetable에서 제거
$('#modal-lecture-task .btn-danger').click(function(){
  var lecture = $(this).parent().parent().parent().find('.lecture-title').text();
  console.log(lecture);
  $.ajax({
    url:'/items/delete_timetable_item/'+lecture,
    method:'patch',
    success:function(){
      window.location = '/';
    }
  })
});

//과제 등록
$(document).on('click','.popover-body .btn-save', function () {
  console.log($(this).parent());
  console.log($('#PopoverContent #recipient-name'));
  console.log($('#PopoverContent #recipient-name').val());
  console.log($('.popover #recipient-name').val());
  console.log($('.popover #message-text').val());

  $.ajax({
    url:'/memos/insert_memo/',
    method:'post',
    data:{
      lecture:$('#modal-lecture-task.modal').find('.lecture-title').text(),
      title: $('.popover #recipient-name').val(),
      discription: $('.popover #message-text').val()
    },
    success:function(res){
      $.get_memo();
      console.log(res);
    }
  })
})

$.get_memo =  function () {
  $.ajax({
    url :'/memos/get_memo/',
    data:{
      lecture:$('#modal-lecture-task.modal').find('.lecture-title').text()
    },
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
        memo_a.setAttribute('href', ' ');

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
    }
  }, 'json');
}


/*
              #modal-lecture-info.modal.fade(role='dialog' aria-hidden='true')
                .modal-dialog(role='document')
                  .modal-content
                    .modal-header
                      button.close(type='button' data-dismiss='modal' aria-label='Close')
                        span(aria-hidden='true') &times;
                    .modal-body
                      h3.lecture-title &#xC6F9; &#xD504;&#xB85C;&#xADF8;&#xB798;&#xBC0D;
                      ul.lecture-info
                        li.lecture-time
                          i.material-icons.ic-lecture-info access_alarm
                          span &#xAC15;&#xC758; &#xC2DC;&#xAC04; : 09:00 - 10:50 | (&#xC6D4;), (&#xC218;)
                        li.lecture-code
                          i.material-icons.ic-lecture-info code
                          span &#xAD50;&#xACFC;&#xBAA9; &#xCF54;&#xB4DC; : A0000001
                        li.lecture-code
                          i.material-icons.ic-lecture-info school
                          span &#xB2F4;&#xB2F9; &#xAD50;&#xC218; : &#xAE40;&#xC9C4;&#xC218;
                        li.lecture-code
                          i.material-icons.ic-lecture-info business
                          span &#xAC15;&#xC758;&#xC2E4; : &#xACF5;&#xD559;&#xAD00; 204
                      .lecture-description
                        p.txt-description
                          | &#xBCF8; &#xAC15;&#xC758;&#xC5D0;&#xC11C;&#xB294; JSP&#xB97C; &#xC774;&#xC6A9;&#xD55C; &#xC6F9; &#xAE30;&#xBC18; &#xD504;&#xB85C;&#xADF8;&#xB798;&#xBC0D; &#xAE30;&#xCD08; &#xBC0F; &#xC751;&#xC6A9;&#xAE30;&#xC220;&#xC5D0; &#xB300;&#xD574; &#xD559;&#xC2B5;&#xD569;&#xB2C8;&#xB2E4;. &#xD2B9;&#xD788; &#xC2E4;&#xC2B5; &#xC704;&#xC8FC;&#xC758; &#xC218;&#xC5C5;&#xC73C;&#xB85C; &#xD504;&#xB85C;&#xADF8;&#xB798;&#xBC0D; &#xC2A4;&#xD0AC; &#xD5A5;&#xC0C1; &#xBC0F;
                          | &#xC2E4;&#xBB34; &#xB2A5;&#xB825;&#xC744; &#xAC16;&#xCD9C; &#xC218; &#xC788;&#xB3C4;&#xB85D; &#xD569;&#xB2C8;&#xB2E4;.
                    .modal-footer
                      button.btn.btn-light(type='button' data-dismiss='modal') &#xCDE8;&#xC18C;
                      button.btn.btn-primary(type='button') &#xACFC;&#xBAA9; &#xB4F1;&#xB85D;&#xD558;&#xAE30;


                      li.lecture-time.two-hr.hr-11(data-event='lecture-01')
                          a(href='#')
                            .lecture-info
                              h6.lecture-title &#xC6F9; &#xD504;&#xB85C;&#xADF8;&#xB798;&#xBC0D;
                              h6.lecture-location &#xACF5;&#xD559;&#xAD00; 204
                            .lecture-noti(data-toggle='tooltip' data-placement='top' title='' data-original-title='과제 설명 텍스트 과제 설명 텍스트 과제 설명 텍스트')
                              i.material-icons.ic-lecture-noti assignment
                              span.lecture-noti-title &#xACFC;&#xC81C; &#xC81C;&#xBAA9; &#xD14D;&#xC2A4;&#xD2B8;
                        li.lecture-time.two-hr.hr-13(data-event='lecture-02')
                          a(href='#')
                            .lecture-info
                              h6.lecture-title &#xD504;&#xB85C;&#xADF8;&#xB798;&#xBC0D;&#xC758; &#xC6D0;&#xB9AC;
                              h6.lecture-location &#xACF5;&#xD559;1&#xAD00; 102
                            .lecture-noti(data-toggle='tooltip' data-placement='top' title='' data-original-title='과제 설명 텍스트 과제 설명 텍스트 과제 설명 텍스트')
                              i.material-icons.ic-lecture-noti assignment
                              span.lecture-noti-title &#xACFC;&#xC81C; &#xC81C;&#xBAA9; &#xD14D;&#xC2A4;&#xD2B8;
                        li.lecture-time.hr-16(data-event='lecture-03')
                          a(href='#')
                            .lecture-info
                              h6.lecture-title &#xB17C;&#xB9AC; &#xC124;&#xACC4;
                              h6.lecture-location &#xACF5;&#xD559;1&#xAD00; 102
*/