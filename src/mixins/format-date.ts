export default {
  methods: {
    formatDate(dateString: string): string {
      return new Intl.DateTimeFormat('default', {
        minute: 'numeric',
        hour: 'numeric',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(dateString));
    },
  },
};
