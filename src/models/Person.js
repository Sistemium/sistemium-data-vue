import ReactiveModel from '@/components/ReactiveModel';

export default new ReactiveModel({
  collection: 'Person',
  schema: {
    name: String,
    id: String,
  },
});
