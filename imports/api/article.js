/**
 * Created by Dulitha RD on 4/14/2017.
 */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Articles = new Mongo.Collection('articles');

var Schemas = {};

Schemas.article = new SimpleSchema({
    articleTitle: {
        type: String,
        label: "Article title",
        max: 250,
        min: 10
    },
    articleBody: {
        type: String,
        label: "Article Body",
        max: 999999,
        min: 1000
    },
    articleType: {
        type: String,
        label: 'Article Type',
    },
    articleImages: {
        type: [String],
        label: 'Article Image',
        minCount: 2,
        maxCount: 12
    },
    createdAt: {
        type: Date,
        label: "Date video was saved",
    },
    owner: {
        type: String,
        label: "User who saved the article"
    },
    username: {
        type: String,
        label: "Username of who saved the article",
        optional: true
    },
    updatedAt: {
        type: Date,
        label: "Date article details were updated",
        optional: true
    }
});

Articles.attachSchema(Schemas.article);

Meteor.methods({
    'articles.insert': function (newArticle) {

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        newArticle.owner = this.userId;
        newArticle.username = Meteor.users.findOne(this.userId).username;

        return Articles.insert(newArticle, {validationContext: 'insertForm'});

    },

    'articles.delete': function (articleId) {

        check(articleId, String);

        if (Meteor.isServer) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            const article = Articles.findOne(articleId);

            if (article.owner !== this.userId) {
                throw new Meteor.Error('not-authorized');
            } else {
                Articles.remove(articleId);
            }
        }
    },

    'articles.update': function (articleId, articleTitle, articleType, articleBody) {

        check(articleId, String);
        check(articleTitle, String);
        check(articleType, String);
        check(articleBody, String);


        const article = Articles.findOne(articleId);

        // Make sure only the task owner can make a task private
        if (article.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        return Articles.update(articleId, {
            $set: {
                articleTitle: articleTitle,
                articleType: articleType,
                articleBody: articleBody,
                updatedAt: new Date()
            }
        });

    },

    'article.user': function (articleId) { //  or try saving post ownerID in a Session
        check(articleId, String);
        return Articles.findOne(articleId).owner;
    }
});
