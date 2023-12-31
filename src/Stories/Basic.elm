module Stories.Basic exposing (main)
import Browser
import Html exposing (Html)

main : Platform.Program () () msg
main =
    Browser.element
        {
            init = \() -> ( (), Cmd.none)
            , update = \_ model -> (model, Cmd.none)
            , view = \_ -> view
            , subscriptions = \_ -> Sub.none
        }

    
view : Html msg
view =
    Html.div [] [Html.text "Hello Storybook from basic component"]