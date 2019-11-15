# programmers 과제 테스트 템플릿 - Node.js

## timetable

## 실행 방법

1. 필요한 패키지 설치

  ```
  npm install
  ```

2. migration 진행

  ```
  sequelize db:migrate
  ```

  >참고 : seqeulize db:migrate:undo를 이용해 migration을 revert 할 수 있습니다.

3. seeding으로 db초기값 설정

  ```
  sequelize db:seed:all
  ```

4. 실행

  ```
  npm start
  ```
  
## RESTful api

#### items

|CRUD|HTTP method|Rout|
|-----------|------|------|
|과목정보 검색|get|/items/search?input='검색어'|
|과목정보를 메모와 같이 가져옴|get|/items/with/memos|
|과목정보 하나 가져오기|get|/items/:id|
|과목 시간표 추가 시 중복검사|post|/items/check-duplicated|
|과목 시간표에 등록|patch|/items/:id/register|
|과목 시간표에서 제거|patch|/items/:id/unregister|

#### memos

|CRUD|HTTP method|Rout|
|-----------|------|------|
|특정 과목에 있는 메모 가져오기|get|/memos/:id|
|특정 과목에 있는 메모 하나 생성|post|/memos|
|특정 과목에 있는 메모 하나 제거|delete|/memos/:id|


