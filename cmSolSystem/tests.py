from django.test import TestCase

def test_sizeNcap():
    assert Jar().size == 0
    assert Jar().capacity == 12
    assert Jar(5).capacity == 5
    with pytest.raises(ValueError):
        Jar(-3)

def test_deposit():
    cookies_in_jar = Jar()
    cookies_in_jar.deposit(1)
    assert cookies_in_jar.size == 1
    cookies_in_jar.deposit(5)
    assert cookies_in_jar.size == 6
    cookies_in_jar.deposit(5)
    assert cookies_in_jar.size == 11
    with pytest.raises(ValueError):
        cookies_in_jar.deposit(2)

def test_withdraw():
    cookies_in_jar = Jar()
    with pytest.raises(ValueError):
        cookies_in_jar.withdraw(1)
    cookies_in_jar.deposit(10)
    cookies_in_jar.withdraw(1)
    assert cookies_in_jar.size == 9
    cookies_in_jar.withdraw(2)
    assert cookies_in_jar.size == 7
    cookies_in_jar.withdraw(3)
    assert cookies_in_jar.size == 4
    cookies_in_jar.withdraw(4)
    assert cookies_in_jar.size == 0
    with pytest.raises(ValueError):
        cookies_in_jar.withdraw(1)


def test_invalidvalues():
    with pytest.raises(ValueError):
        Jar(2).deposit(3)
    with pytest.raises(ValueError):
        Jar().withdraw(1)
