const { validationResult } = require('express-validator')
const fs = require('fs')
const { APP_URL } = process.env
const bookModel = require('../models/books')
const pagination = require('../utils/pagination')

module.exports = {

    getAllBooks: async (request, response) => {
        const { page, limit, search, sort } = request.query
        const condition = {
            search,
            sort
            
        }

        if (request.user.nameUser === null) {
            const data = {
                success: false,
                message: 'Please update your profile'
            }
            response.status(400).send(data)
            return false
        }
        const sliceStart = pagination.getPage(page) * pagination.getPerPage(limit) - pagination.getPerPage(limit)
        const sliceEnd = (pagination.getPage(page) * pagination.getPerPage(limit))
        const totalData = await bookModel.getBooksCount(condition)
        const totalPage = Math.ceil(totalData / pagination.getPerPage(limit))
        const prevLink = pagination.getPrevLink(pagination.getPage(page), request.query) 
        const nextLink = pagination.getNextLink(pagination.getPage(page), totalPage, request.query)

        const bookData = await bookModel.getAllBooks(sliceStart, sliceEnd, condition)
        const data = {
            success: true,
            message: 'List All Book',
            data: bookData.map(data => ({ 
                id: data.id, 
                title: data.title, 
                image: `${APP_URL}` + data.image,
                genreName: data.genreName,
                nameStatus: data.nameStatus,
                created_at: data.created_at,
                updated_at: data.updated_at
            })),
            pageInfo: {
                page: pagination.getPage(page),
                totalPage,
                perPage: pagination.getPerPage(limit),
                totalData,
                nextLink: nextLink && `${APP_URL}users?${nextLink}`,
                prevLink: prevLink && `${APP_URL}users?${prevLink}`
            }
        }
        response.status(200).send(data)
    },

    createBook: async (request, response) => {
        const { title, description, genre_id, author_id, release_date, status_id } = request.body
        if (!request.file) {
            const data = {
                success: true,
                message: `Please upload a file`
            }
            response.status(400).send(data)
        } else {    
            const image  = request.file.path 
            
           const Error = await validationResult(request)
            if (!Error.isEmpty()) {
                const data = {
                    success: false,
                    message: Error.array()
                }
                response.status(400).send(data)
                return
            } 
            const bookData = {
                title,
                description,
                image,
                genre_id,
                author_id,
                release_date,
                status_id
            }
            const results = await bookModel.createBook(bookData)
            if (results) {
                const data = {
                    success: true,
                    message: 'create book has been success',
                    data: bookData
                }
                response.status(201).send(data)
            } else {
                const data = {
                    success: false,
                    message: 'Failed create book'
                }
                response.status(400).send(data)
            }
        }
    },

    updateBook: async (request, response) => {
        const { id } = request.params
        const { title, description, genre_id, author_id } = request.body
        const image  = request.file.path 
        if (!request.file) {
            const data = {
                success: true,
                message: `Please upload a file`
            }
            response.status(400).send(data)
        } else {   
            const Error = await validationResult(request)
                if (!Error.isEmpty()) {
                    const data = {
                        success: false,
                        message: Error.array()
                    }
                    response.status(422).send(data)
                    return
                }
            const checkId = await bookModel.getBookByCondition({ id: parseInt(id) })
            if (checkId.length > 0) {
                if (checkId[0].image !== image) {
                    await fs.unlinkSync(checkId[0].image)
                    const bookData = [
                        { title, description, image, genre_id, author_id },
                        { id: parseInt(id) }
                    ]
                    const results = await bookModel.updateBook(bookData)
                    if (results) {
                        const data = {
                            success: true,
                            message: 'book has been update',
                            data: bookData[0]
                        }
                        response.status(201).send(data)
                    } else {
                        const data = {
                            success: false,
                            message: 'Failed update book'
                        }
                        response.status(401).send(data)
                    }
                } else {
                    const data = {
                        success: false,
                        message: `book with ${id} not found`
                    }
                    response.status(400).send(data)
                } 
            } else {
                const data = {
                    success: false,
                    message: `No image ${checkId[0].image} for delete, and delete your book to create new book` 
                }
                response.status(400).send(data)
            }
        }
    },

    deleteBook: async (request, response) => {
        const { id } = request.params
        const _id = { id: parseInt(id) }
        const checkId = await bookModel.getBookByCondition(_id)
       
        if (checkId.length > 0) {
            fs.unlinkSync(checkId[0].image) 
            const results = await bookModel.deleteBook(_id)
            if (results) {
                const data = {
                    success: true,
                    message: `Book with id ${id} is deleted `
                }
                response.status(200).send(data)
            } else {
                const data = {
                    success: false,
                    message: 'Failed delete book'
                }
                response.status(400).send(data)
            }
        } else {
            const data = {
                success: false,
                message: 'Not data for delete'
            }
            response.status(400).send(data)
        }
    },

    getDetailBook: async (request, response) => {
        const { id } = request.params
        const isFoundId = await bookModel.getBookByCondition({ id })
        if (isFoundId.length > 0) {
            const bookData = await bookModel.getDetailBook(id)
            if (bookData) {
                const data = {
                    success: true,
                    message: 'Detail book',
                    data: bookData.map(data => ({ 
                        id: data.id, 
                        title: data.title, 
                        description: data.description,
                        image: `${APP_URL}` + data.image,
                        authorName: data.authorName,
                        genreName: data.genreName,
                        releaseDate: data.releaseDate,
                        nameStatus: data.nameStatus,
                        descriptionStatus: data.descriptionStatus,
                        created_at: data.created_at,
                        updated_at: data.updated_at
                    }))
                }
                response.status(200).send(data)
            } else {
                const data = {
                    success: false,
                    message: 'Failed load detail book'
                }
                response.status(401).send(data)
            }
        } else {
            const data = {
                success: false,
                message: 'Book not found'
            }
            response.status(400).send(data)
        }
    }

}