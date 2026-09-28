import conf from "../conf/conf";

import { Client, ID, Databases, Query, Storage } from "appwrite";

export class Service{
    Client = new Client()
    databases;
    bucket;
    constructor(){
        this.Client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

        this.databases=new Databases(this.Client);
        this.bucket=new Storage(this.Client)

        }
        async createPost({title, slug, content, featuredImage, status, userId}){
            try {
                const safeSlug = (slug && typeof slug === "string")
                    ? slug.trim().toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '-').replace(/^-+|-+$/g, '').slice(0, 36)
                    : "";
                const documentId = safeSlug || ID.unique();

                return await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    documentId,
                    {
                        title,
                        content,
                        featuredImage,
                        status,
                        userId
                    }
                )   
            } catch (error) {
                console.error("Appwrite Service :: createPost :: error", error);
                throw error;
            }
        }

        async updatePost(slug,{title, content, featuredImage, status,}){
            try {
                const safeSlug = String(slug).slice(0, 36);
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    safeSlug,
                    {
                        title,
                        content,
                        featuredImage,
                        status,
                    }
                ) 
            } catch (error) {
                 console.error("Appwrite Service :: updatePost :: error", error);
                 throw error;
            }
        }

        async deletePost(slug){
            try {
                await this.databases.deleteDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug,
                )
                return true 
            } catch (error) {
                 console.log("Appwrite Service :: deletePost :: error",error)
                 return false
            }
        }

        async getPost(slug){
            try {
                return await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug
                )
            } catch (error) {
                 console.log("Appwrite Service :: getPost :: error",error)
                 return false
            }
        }

        async getPosts(queries = [Query.equal("status", "active")]){
            try {
                return await this.databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    queries,

                )
            } catch (error) {
                 console.log("Appwrite Service :: getPosts :: error",error)
                 return false
            }
        }

        async uploadFile(file){
            try {
                return await this.bucket.createFile(
                    conf.appwriteBucketId,
                    ID.unique(),
                    file
                )
            } catch (error) {
                 console.log("Appwrite Service :: uploadFile :: error",error)
                 return false
            }
        }

        async deleteFile(fileId){
            try {
                await this.bucket.deleteFile(
                    conf.appwriteBucketId,
                    fileId
                )
                return true
            } catch (error) {
                console.log("Appwrite Service :: deletePost :: error",error)
                return false
            }
        }

        getFilePreview(fileId){
            if (!fileId) return "";
            if (typeof fileId === "string" && (fileId.startsWith("http://") || fileId.startsWith("https://") || fileId.startsWith("data:"))) {
                return fileId;
            }
            try {
                return this.bucket.getFilePreview(
                    conf.appwriteBucketId,
                    fileId
                ).toString();
            } catch (error) {
                console.error("Appwrite Service :: getFilePreview :: error", error);
                return "";
            }
        }

        getFileView(fileId){
            if (!fileId) return "";
            if (typeof fileId === "string" && (fileId.startsWith("http://") || fileId.startsWith("https://") || fileId.startsWith("data:"))) {
                return fileId;
            }
            try {
                return this.bucket.getFileView(
                    conf.appwriteBucketId,
                    fileId
                ).toString();
            } catch (error) {
                console.error("Appwrite Service :: getFileView :: error", error);
                return "";
            }
        }
    }


const service = new Service()
export default service