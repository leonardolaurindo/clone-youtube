import {
    Container,
    LogoContainer,
    ButtonContainer,
    ButtonIcon,
    SearchContainer,
    SearchInputContainer,
    SearchInput,
    SearchButton,
} from "./styles";
import HamburguerIcon from '../../assets/hamburger.png';
import Logo from '../../assets/YouTube-Logo.png';
import Lupa from '../../assets/search.png';
import MicIcon from '../../assets/mic.png';

function Header() {
    return (
        <Container>
            <LogoContainer>
                <ButtonContainer>
                    <ButtonIcon alt="Hamburguer Icon" src={HamburguerIcon} />
                </ButtonContainer>
                <img
                    style={{ cursor: 'pointer', width: '100px' }}
                    alt="YouTube Logo"
                    src={Logo}
                />
            </LogoContainer>
            <SearchContainer>
                <SearchInputContainer>
                    <SearchInput placeholder="Pesquisar..." />
                </SearchInputContainer>
                <SearchButton>
                    <ButtonIcon alt="Search Icon" src={Lupa} />
                </SearchButton>
                <ButtonContainer>
                    <ButtonIcon alt="Mic Icon" src={MicIcon} />
                </ButtonContainer>
            </SearchContainer>
        </Container>
    )
}
export default Header;