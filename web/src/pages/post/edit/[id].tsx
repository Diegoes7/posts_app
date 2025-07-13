import React from 'react';
import EditPost from '../../../components/editPost';
import { withApollo } from '../../../utils/withApollo';

function EditPostPage() {
	return <EditPost />;
}

export default withApollo({ ssr: false })(EditPostPage);
