// 获取元素
const notepad = document.getElementById('notepad');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const newNoteBtn = document.getElementById('newNoteBtn');
const notesList = document.getElementById('notesList');
const message = document.getElementById('message');

// 笔记数据
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId = null;

// 渲染笔记列表
function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${note.title} (${note.date})</span>
            <div class="note-actions">
                <button class="edit-btn" onclick="editTitle(${index})">编辑标题</button>
                <button onclick="deleteNote(${index})">删除</button>
            </div>
        `;
        li.addEventListener('click', () => loadNote(index));
        notesList.appendChild(li);
    });
}

// 加载笔记
function loadNote(index) {
    currentNoteId = index;
    notepad.value = notes[index].content;
    message.textContent = `已加载笔记：${notes[index].title}`;
    message.style.color = '#28a745';
}

// 保存笔记
saveBtn.addEventListener('click', () => {
    const content = notepad.value.trim();
    if (content === '') {
        message.textContent = '内容不能为空！';
        message.style.color = '#dc3545';
        return;
    }

    const date = new Date().toLocaleString();
    const title = notes[currentNoteId] ? notes[currentNoteId].title : `笔记 ${notes.length + 1}`;

    if (currentNoteId !== null) {
        // 更新现有笔记
        notes[currentNoteId].content = content;
        notes[currentNoteId].date = date;
    } else {
        // 添加新笔记
        notes.push({ title, content, date });
        currentNoteId = notes.length - 1;
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    message.textContent = '笔记已保存！';
    message.style.color = '#28a745';
});

// 清空当前笔记
clearBtn.addEventListener('click', () => {
    notepad.value = '';
    currentNoteId = null;
    message.textContent = '当前笔记已清空！';
    message.style.color = '#dc3545';
});

// 新建笔记
newNoteBtn.addEventListener('click', () => {
    notepad.value = '';
    currentNoteId = null;
    message.textContent = '可以开始新建笔记了！';
    message.style.color = '#28a745';
});

// 删除笔记
function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    message.textContent = '笔记已删除！';
    message.style.color = '#dc3545';
    if (currentNoteId === index) {
        notepad.value = '';
        currentNoteId = null;
    }
}

// 编辑标题
function editTitle(index) {
    const newTitle = prompt('请输入新的标题：', notes[index].title);
    if (newTitle && newTitle.trim() !== '') {
        notes[index].title = newTitle.trim();
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
        message.textContent = '标题已更新！';
        message.style.color = '#28a745';
    }
}

// 初始化加载笔记列表
window.addEventListener('load', () => {
    renderNotes();
});