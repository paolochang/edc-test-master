<img src="/React/demo/course.png" width="600px" title="Course" alt="Course"></img><br/>

# Habit Tracker

이 프로젝트는 [드림코딩 아카데미](http://academy.dream-coding.com/)에서 진행중인 [리액트 기본강의 & 실전 프로젝트 3개](https://academy.dream-coding.com/courses/react-basic) (유튜브 클론 코딩과 실시간 데이터베이스 저장 명함 만들기 웹앱을 통해 프론트엔드 완성)강의에서 **리액트 개념 정리를 위해 쓰인 예제 프로그램** 입니다.

<img src="/React/demo/habit.png" width="600px" title="Habit Tracker" alt="Habit Tracker"></img><br/>

Unit Test 작업시 `auto-complete` 기능이 작동하지 않을때:

1.  Install `@types/jest` as dev dependency:

        $ npm install @types/jest --save-dev

2.  Create jsconfig.json:

        {
            "typeAcquisition": {
                "include": ["jest"]
            }
        }

Component Test Snapshot:

- Use `render` from `testing-library`:

        const component = render(<HabitAddForm onAdd={jest.fn()} />);
        expect(component.container).toMatchSnapshot();

OR

- Install `react-test-renderer`:

        $ npm i react-test-renderer --save-dev

        const component = renderer.create<HabitAddForm onAdd={jset.fn()} />);
        expect(component.toJSON()).toMatchSnapshot();

## References:

- [React Docs: Testing Overview](https://reactjs.org/docs/testing.html)
