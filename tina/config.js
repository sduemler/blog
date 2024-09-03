import { defineConfig } from 'tinacms';

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || 'main';

export default defineConfig({
  branch,
  clientId: process.env.TINACLIENTID, // Get this from tina.io
  token: process.env.TINATOKEN, // Get this from tina.io

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'assets',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'post',
        label: 'Posts',
        path: 'src/posts',
        defaultItem: () => ({
          title: 'New Post',
          layout: '../layouts/BlogPost.astro',
          added: new Date(),
          tags: [],
        }),
        ui: {
          dateFormat: 'MMM DD YYYY',
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, '-');
            },
          },
        },
        fields: [
          {
            name: 'layout',
            label: 'Layout',
            type: 'string',
            required: true,
            searchable: false,
          },
          {
            name: 'title',
            label: 'Title',
            type: 'string',
            isTitle: true,
            required: true,
          },
          {
            label: 'Slug',
            name: 'slug',
            type: 'string',
            required: true,
          },
          {
            label: 'Description',
            name: 'description',
            type: 'string',
            required: true,
          },
          {
            label: 'Tags',
            name: 'tags',
            type: 'string',
            list: true,
            options: [
              {
                value: 'technical',
                label: 'Technical',
              },
              {
                value: 'advice',
                label: 'Advice',
              },
              {
                value: 'events',
                label: 'Events',
              },
              {
                value: 'learning',
                label: 'Learning',
              },
              {
                value: 'meta',
                label: 'Meta',
              },
              {
                value: 'work',
                label: 'Work',
              },
              {
                value: 'personal',
                label: 'Personal',
              },
              {
                value: 'musings',
                label: 'Musings',
              },
              {
                value: 'writing',
                label: 'Writing',
              },
              {
                value: 'music',
                label: 'Music',
              },
              {
                value: 'health',
                label: 'Health',
              },
              {
                value: 'gaming',
                label: 'Gaming',
              },
            ],
          },
          {
            label: 'Added',
            name: 'added',
            type: 'datetime',
            dateFormat: 'MMM DD YYYY',
            required: true,
          },
          {
            label: 'Updated',
            name: 'updated',
            type: 'datetime',
            dateFormat: 'MMM DD YYYY',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
  search: {
    tina: {
      indexerToken: process.env.TINASEARCH,
      stopwordLanguages: ['eng'],
    },
    indexBatchSize: 50,
    maxSearchIndexFieldLength: 100,
  },
});
