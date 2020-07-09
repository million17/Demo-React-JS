import React, { Component } from 'react'
import TaskList from './../components/TaskList';
import TaskForm from '../components/TaskForm';
import Controll from '../components/Controll';
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [
                //id unique, name, status

            ],
            isDisplayForm: false,
            taskEditing: null,
            filter: {
                name: '',
                status: -1
            },
            keyWord: '',
            sortBy: 'name',
            sortValue: 1
        }
    }

    componentWillMount() {
        //Khi refresh lại sẽ gọi thằng này, và gọi duy nhất 1 lần sau khi load
        if (localStorage && localStorage.getItem('tasks')) {
            var tasks = JSON.parse(localStorage.getItem('tasks'));
            this.setState({
                tasks: tasks,
            })
        }
    }

    s4() {
        //Viết 1 hàm random key
        return Math.floor((1 * Math.random()) * 0x10000).toString(16).substring(1);
    }

    generateId() {
        //Generate Key để k bị trùng lặp với bất kì phần tử nào
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4();
    }

    _onTouggleForm = () => { // Add task
        if (this.state.isDisplayForm && this.state.taskEditing !== null) {
            this.setState({
                //Click thì là true và ngược lại
                isDisplayForm: true,
                taskEditing: null
            })
        } else {
            this.setState({
                //Click thì là true và ngược lại
                isDisplayForm: !this.state.isDisplayForm,
                taskEditing: null
            })
        }

    }

    _onCloseForm = () => {
        this.setState({
            isDisplayForm: false,
        })
    }

    _onShowForm = () => {
        this.setState({
            isDisplayForm: true,
        })
    }

    _onSubmit = (data) => {
        var { tasks } = this.state;
        if (data.id === '') {
            data.id = this.generateId();// task
            tasks.push(data);
        } else {
            //Edit
            var index = this.findIndex(data.id);
            tasks[index] = data;
        }


        this.setState({
            tasks: tasks,
            taskEditing: null
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
        console.log(data);

    }

    _onUpdateStatus = (id) => {
        var { tasks } = this.state;
        console.log(`Log id từ thằng cha gọi xuống thằng con `, id)
        var index = this.findIndex(id);
        console.log(`Index`, index);
        if (index !== -1) {
            tasks[index].sltStatus = !tasks[index].sltStatus;
            this.setState({
                tasks: tasks
            });
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    _onDeleteTask = (id) => {
        var { tasks } = this.state;
        console.log(`Log id từ thằng cha gọi xuống thằng con `, id)
        var index = this.findIndex(id);
        console.log(`Index`, index);
        if (index !== -1) {
            tasks.splice(index, 1);//Xóa đi phần tử khi tìm thấy bằng splice
            this.setState({
                tasks: tasks
            });
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
        this._onCloseForm();
    }

    _onUpdate = (id) => {
        var { tasks } = this.state;
        console.log(`Update `, id)
        var index = this.findIndex(id);
        var taskEditing = tasks[index];
        console.log(`Task Editing `, taskEditing);
        this.setState({
            taskEditing: taskEditing,

        });
        this._onShowForm();

    }

    _onFilter = (filterName, filterStatus) => {
        console.log(`filter`, filterName + ' - ' + filterStatus);
        filterStatus = parseInt(filterStatus);
        this.setState({
            filter: {
                txtTaskName: filterName.toLowerCase(),
                sltStatus: filterStatus
            }
        });
    }

    _onSearch = (keyWord) => {
        console.log(keyWord);
        this.setState({
            keyWord: keyWord
        })
    }

    _onSort = (sortBy, sortValue) => {

        this.setState({
            sortBy: sortBy,
            sortValue: sortValue
        })
        console.log(`Sort : `, this.state);
    }

    findIndex = (id) => {
        var { tasks } = this.state;
        var result = -1;
        tasks.forEach((task, index) => {

            if (task.id === id) {
                // console.log(index);  
                result = index;
            }
        });
        return result;

    }

    render() {
        var {
            tasks,
            isDisplayForm,
            taskEditing,
            filter,
            keyWord,
            sortBy,
            sortValue } = this.state;//== var tasks = this.state.tasks
        if (filter) {
            if (filter.txtTaskName) {
                tasks = tasks.filter((task) => {
                    return task.txtTaskName.toLowerCase().indexOf(filter.txtTaskName) !== -1;
                });
            }
            tasks = tasks.filter((task) => {
                if (filter.sltStatus === -1) {
                    return task;
                } else {
                    return task.sltStatus === (filter.sltStatus === 1 ? true : false);
                }
            })
        }
        if (keyWord) {
            tasks = tasks.filter((task) => {

                return task.txtTaskName.toLowerCase().indexOf(keyWord) !== -1;

            })
        }
        if (sortBy === 'name') {
            tasks.sort((a, b) => {
                if (a.txtTaskName > b.txtTaskName) return sortValue;
                else if (a.txtTaskName < b.txtTaskName) return -sortValue;
                else return 0;
            })
        } else {
            tasks.sort((a, b) => {
                if (a.sltStatus > b.sltStatus) return -sortValue;
                else if (a.sltStatus < b.sltStatus) return sortValue;
                else return 0;
            })
        }

        var elmTaskForm = isDisplayForm
            ? <TaskForm
                onCloseForm={this._onCloseForm}
                onSubmit={this._onSubmit}
                task={taskEditing} />
            : '';// Check nếu là true thì hiện TaskForm còn không thì rỗng
        return (
            <div className="row my-5">
                {elmTaskForm}
                {/* Check nếu là true thì hiện TaskForm còn không thì rỗng */}
                <div className={isDisplayForm ? 'col-8' : 'col-12'}>
                    <div className="my-3">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this._onTouggleForm}
                        >
                            Add to do
                            </button>

                        {/* <button
                            type="button"
                            className="btn btn-primary mx-2"
                            onClick={
                                this._onGenerateData
                            }>Generate Data</button> */}
                    </div>
                    {/* Search And Sort */}
                    <Controll
                        onSort={this._onSort}
                        onSearch={this._onSearch}
                        sortBy={sortBy}
                        sortValue={sortValue} />
                    {/* end Search */}
                    <TaskList
                        tasks={tasks}
                        onUpdateStatus={this._onUpdateStatus}
                        onUpdate={this._onUpdate}
                        onDeleteTask={this._onDeleteTask}
                        onFilter={this._onFilter} />
                </div>
            </div>
        )
    }
}
