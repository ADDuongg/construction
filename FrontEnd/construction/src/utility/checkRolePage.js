import Cookies from 'js-cookie'
const dataUser = Cookies.get('user')
const user = dataUser ? JSON.parse(dataUser) : null;

const filteredProjects = (data) => {
    data?.projects?.data?.filter(project => {
        if (user?.chucvu === 'construction manager') {
            return project.id === user?.duan_id;
        }
        if (user.chucvu === 'project manager') {
            return true;
        }
        return false;
    });
}

export default filteredProjects