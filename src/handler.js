const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;


    const id = nanoid(16);
    const createdAt = new Date().toDateString();
    const updateAt = createdAt;

    const newPush = {
        title, tags, body, id, createdAt, updateAt,
    };

    notes.push(newPush);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'catatan Berhasil ditambahkan',
            data: {
                noteID: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Status gagal di tambhakan',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
}

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal di hapus. Id tidak di temukan',
    });
    response.code(404);
    return response;

};



module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler}; 